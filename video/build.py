#!/usr/bin/env python3
"""Build the 90-second concept video (macOS only).

Narration: macOS `say`. Shots: headless Chrome screenshots of scenes.html.
Assembly: ffmpeg. Output: out/concept-video.mp4 (1920x1080, 30 fps, 90 s).

    python3 video/build.py
"""
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / "out"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
VOICE = "Samantha"  # ponytail: built-in TTS stand-in; swap in a recorded voice track for the real cut
TARGET_WPM = 134  # Samantha ignores `say -r`, so the speech is time-stretched to this pace
TOTAL = 90.0
LEAD = 0.5  # silence before each section's first line
GAP = 0.3  # shortest pause between lines

# Voiceover exactly as written, split where the picture changes.
LINES = {
    "p1": "Discovery can start with curiosity.",
    "p2": "In research published by Deloitte Digital and TikTok, 57 percent of surveyed TikTok users said they discover products without actively looking for them.",
    "p3": "For people exploring new apps and AI tools, feature lists don’t always answer:",
    "p4": "’What could I actually do with this?’",
    "h1": "Our hypothesis is that short videos showing real use and results can make discovery more engaging than product listings,",
    "h2": "and a product’s value easier to understand.",
    "h3": "For people who enjoy exploring apps and AI tools, ‘I didn’t know that was possible’",
    "h4": "could become ‘I want to try it.’",
    "h5": "Useful discoveries could give them a reason to come back for more.",
    "s1": "We’re starting on the web, with short videos from users and companies.",
    "s2": "Users share their experiences and what they create.",
    "s3": "Companies share product introductions, demos, and promotional videos.",
    "s4": "Each video links to the product, with options to save, share, try, or buy.",
    "s5": "People can post their own experiences, too.",
    "s6": "What one person tries can become the next person’s discovery.",
}

# (start, end, [(line, weight of the extra pause after it)]). The solution lines
# need ~31 s at this pace, so it starts 2 s early and narration ends ~1:25.3.
CLOSE = 85.3
SECTIONS = [
    (0.0, 25.0, [("p1", 1), ("p2", 2.5), ("p3", 0.2), ("p4", 1.5)]),
    (25.0, 53.0, [("h1", 0.2), ("h2", 1), ("h3", 0.2), ("h4", 1), ("h5", 1.5)]),
    (53.0, CLOSE, [("s1", 1), ("s2", 0.6), ("s3", 0.6), ("s4", 3), ("s5", 0.6), ("s6", 0.8)]),
]

# Picture cuts: (shot id in scenes.html, when). `when` is seconds, a line id
# (cut as that line starts) or (line id, fraction of the way through it).
CUTS = [
    ("p1", 0.0), ("p2", "p2"), ("p3", "p3"), ("p4", "p4"),
    ("h1", 25.0), ("h2", ("h1", 0.55)), ("h3", "h2"),
    ("h4", ("h3", 0.45)), ("h5", "h4"), ("h6", ("h4", 0.7)), ("h7", "h5"),
    ("s1", 53.0), ("s2", "s2"), ("s3", "s3"), ("s4", "s4"),
    ("s5", ("s4", 0.8)), ("s6", "s5"), ("s7", "s6"),
    ("end", CLOSE),
]


def run(*cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        check=True, capture_output=True, text=True,
    )
    return float(out.stdout)


def narrate():
    """Speak every line at TARGET_WPM; return {line: (path, seconds)}."""
    (OUT / "vo").mkdir(parents=True, exist_ok=True)
    raw = {}
    for key, text in LINES.items():
        raw[key] = OUT / "vo" / f"{key}.aiff"
        run("say", "-v", VOICE, "-o", str(raw[key]), text)
    words = sum(len(t.split()) for t in LINES.values())
    natural = words / sum(duration(p) for p in raw.values()) * 60
    tempo = TARGET_WPM / natural  # atempo keeps the pitch
    clips = {}
    for key, src in raw.items():
        path = src.with_suffix(".wav")
        run("ffmpeg", "-y", "-i", str(src), "-filter:a", f"atempo={tempo:.4f}", "-ar", "48000", str(path))
        clips[key] = (path, duration(path))
    return clips


def layout(clips):
    """Place each line inside its section; spare time becomes weighted pauses."""
    starts = {}
    for start, end, lines in SECTIONS:
        spoken = sum(clips[k][1] for k, _ in lines)
        spare = end - start - LEAD - spoken - GAP * len(lines)
        if spare < 0:
            raise SystemExit(f"Section {start:.0f}-{end:.0f}s is {-spare:.1f}s too long; raise TARGET_WPM.")
        print(f"section {start:.0f}-{end:.0f}s: {spare:.1f}s of extra pauses")
        weights = sum(w for _, w in lines)
        t = start + LEAD
        for key, w in lines:
            starts[key] = t
            t += clips[key][1] + GAP + spare * w / weights
    return starts


def cut_times(clips, starts):
    def at(when):
        if isinstance(when, float):
            return when
        if isinstance(when, str):
            return starts[when]
        key, frac = when
        return starts[key] + clips[key][1] * frac

    times = [(shot, at(when)) for shot, when in CUTS]
    assert all(a[1] < b[1] for a, b in zip(times, times[1:])), times
    return times


def render_shots():
    (OUT / "shots").mkdir(parents=True, exist_ok=True)
    for shot, _ in CUTS:
        run(
            CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
            "--force-device-scale-factor=2", "--window-size=1920,1080",
            f"--user-data-dir={OUT / 'chrome'}",
            f"--screenshot={OUT / 'shots' / f'{shot}.png'}",
            f"{(ROOT / 'scenes.html').as_uri()}#{shot}",
        )


def assemble(clips, starts, times):
    # Picture: one still per cut, held until the next cut.
    ends = [t for _, t in times[1:]] + [TOTAL]
    lines = []
    for (shot, t), end in zip(times, ends):
        lines += [f"file 'shots/{shot}.png'", f"duration {end - t:.3f}"]
    lines.append(f"file 'shots/{times[-1][0]}.png'")  # concat demuxer needs the last file twice
    (OUT / "shots.txt").write_text("\n".join(lines) + "\n")

    # Sound: every line delayed to its start time, mixed into one track.
    keys = list(starts)
    inputs = [arg for k in keys for arg in ("-i", str(clips[k][0]))]
    mix = "".join(
        f"[{i}]aresample=48000,adelay={round(starts[k] * 1000)}:all=1[a{i}];" for i, k in enumerate(keys)
    )
    mix += "".join(f"[a{i}]" for i in range(len(keys)))
    mix += f"amix=inputs={len(keys)}:normalize=0,apad,atrim=0:{TOTAL}[vo]"
    run("ffmpeg", "-y", *inputs, "-filter_complex", mix, "-map", "[vo]", str(OUT / "vo.wav"))

    run(
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(OUT / "shots.txt"), "-i", str(OUT / "vo.wav"),
        "-vf", "scale=1920:1080:flags=lanczos,fps=30,format=yuv420p",
        "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-c:a", "aac", "-b:a", "192k",
        "-t", str(TOTAL), "-movflags", "+faststart", str(OUT / "concept-video.mp4"),
    )


def main():
    clips = narrate()
    starts = layout(clips)
    times = cut_times(clips, starts)
    render_shots()
    assemble(clips, starts, times)

    words = sum(len(t.split()) for t in LINES.values())
    spoken = sum(d for _, d in clips.values())
    last = max(starts[k] + clips[k][1] for k in starts)
    print(f"{words} words, {spoken:.1f}s spoken ({words / spoken * 60:.0f} wpm), narration ends at {last:.1f}s")
    for shot, t in times:
        print(f"  {t:5.1f}s  {shot}")
    print(OUT / "concept-video.mp4")


if __name__ == "__main__":
    main()
