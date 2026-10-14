# RAD website

The static project website for **Reward-Aligned Distillation (RAD)**.

- Paper: <https://arxiv.org/abs/2610.14572>
- Website: <https://reward-aligned-distillation.github.io/>
- Source: <https://github.com/reward-aligned-distillation/reward-aligned-distillation.github.io>

The site uses HTML, CSS, and vanilla JavaScript. It has no build step or external
runtime dependencies. Open the local repository as a dedicated website project.

## Preview locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. Stop the server with Ctrl+C.

## Content and provenance

The displayed scores match Tables 1 and 8 of arXiv:2610.14572v1 and the
current paper snapshots in the parent RAD research checkout. The source paths
below are relative to that research checkout; the manuscript is not bundled in
this standalone website repository.

The displayed author order and BibTeX follow the paper PDF.

| Website asset | Original source |
| --- | --- |
| `assets/main-results.png` | `paper/figures/paper/main_results_overview_current.png` |
| `assets/math-training.png` | `paper/figures/paper/math_eval_dynamics.png` |
| `assets/coding-results.png` | `paper/figures/paper/coding_results_bars.png` |
| `assets/RAD_explainer_v2.mp4` | User-supplied RAD explainer, preserved unchanged |

The main comparison counts 102,400 generated training responses, including RAD's
meta responses. RAD uses 100 updates; baselines and RAD-Simple use 200. Math table
means average six benchmarks, while the math training curves average four.
Standard deviations describe sampled response positions, not training seeds.

The explainer video is H.264/AAC, 1920×1080, about 3:02, with fast-start MP4
metadata. The player uses native controls, inline playback, metadata preloading,
a vector poster, and a download fallback.

## Interactive method

`method.js` implements an educational illustration of zero-origin signed token
weighting: `w = clip(γ I, −1, +1)`. Visitors can compare uniform OPD with RAD,
change the illustrative weight step size, inspect a token, and walk through the
five stages of a training iteration. The numerical scores are explicitly
illustrative; this component runs no language models or evaluations.

`site.js` adds accessible result tabs and BibTeX copying. Without JavaScript, both
result categories remain readable, the video works, and the method explanation
has a static fallback. The supplied `Reward-Aligned Distillation.html` remains a
local design reference and is preserved unchanged.

The design takes inspiration from the research presentation at
<https://self-distillation.github.io/SDPO> and
<https://research.nvidia.com/labs/lpr/pivotopd/>. RAD's content and assets come from
its own paper and supplied materials.

## GitHub Pages

Serve these files from the `main` branch and repository root. The `.nojekyll`
file keeps the site buildless. All local asset paths are relative and work at
the organization site's root URL.
