# Saudi Arabia UGT × ARDL 3D Econometric Visualization

A focused Next.js/React/Three.js visualization of the reported Saudi Arabia econometric project.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Concept

The interface keeps one continuous visual field for the actual 1992–2023 observations and the reported ARDL workflow. The year selector does not re-estimate the model. It only changes which observations and lagged observations are highlighted.

The supplied ARDL equation is shown exactly in the context panel. Reported ADF, structural-break, bounds, long-run and ECM results are displayed only at their corresponding workflow stages.

Source: World Bank World Development Indicators and the project report.
