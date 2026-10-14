# RAD website

A static research-project website for **Reward-Aligned Distillation (RAD)**.
The source repository is [yilanchen6/rad-website](https://github.com/yilanchen6/rad-website).
The site uses plain HTML and CSS, with no build step or external dependencies.

## Preview locally

From this directory:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. Stop the preview with Ctrl+C.

## Content and provenance

The page describes RAD using the current manuscript, `paper/rad_iclr2027.tex`.
`assets/main-results.png` is an unchanged copy of the manuscript's
`paper/figures/paper/main_results_overview_current.png`. These source paths
are relative to the parent RAD research checkout; the manuscript is not
included in this standalone website repository.

The headline comparison uses RAD at 100 updates and baselines at 200 updates,
with matched training-response budgets. Coding results are LiveCodeBench-v6
pass@1 for Qwen3-1.7B (non-thinking) and OLMo3-7B-Instruct. The 6.5 percentage
point math gain is the Qwen3-1.7B mean across six competition-math benchmarks.

Keep the page and figure synchronized with the manuscript when results change.
Add approved paper, code, and author links before publication.

## GitHub Pages

These website files belong at the root of the `rad-website` repository. After
pushing, configure GitHub Pages to deploy from the `main` branch and root
directory. The `.nojekyll` file allows the static files to be served directly.

Once GitHub Pages is enabled, the default website URL will be
`https://yilanchen6.github.io/rad-website/`.
