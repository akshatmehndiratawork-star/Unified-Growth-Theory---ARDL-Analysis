"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import ThreeDStage from "../components/ThreeDStage";
import { RAW_DATA, ADF_RESULTS, BREAKS, LONG_RUN, SHORT_RUN, BOUNDS, MODEL_STATS } from "../data/dataset";

type Stage = "raw" | "stationarity" | "breaks" | "ardl" | "longrun" | "ecm";

const stages: { id: Stage; label: string; sub: string }[] = [
  { id: "raw", label: "RAW LEVELS", sub: "actual observations" },
  { id: "stationarity", label: "ADF / DIFFERENCE", sub: "I(1) evidence" },
  { id: "breaks", label: "STRUCTURAL BREAKS", sub: "reported break test" },
  { id: "ardl", label: "ARDL", sub: "ARDL(2,1,3,2)" },
  { id: "longrun", label: "LONG RUN", sub: "bounds relationship" },
  { id: "ecm", label: "ECM / SHORT RUN", sub: "adjustment" },
];

const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

function Equation() {
  return (
    <div className="equationBox">
      <div>Y<sub>t</sub> = c + φ<sub>1</sub>Y<sub>t−1</sub> + φ<sub>2</sub>Y<sub>t−2</sub></div>
      <div>+ β<sub>0</sub>FERT<sub>t</sub> + β<sub>1</sub>FERT<sub>t−1</sub> + β<sub>2</sub>FERT<sub>t−2</sub> + β<sub>3</sub>FERT<sub>t−3</sub></div>
      <div>+ γ<sub>0</sub>HC<sub>t</sub> + γ<sub>1</sub>HC<sub>t−1</sub></div>
      <div>+ δ<sub>0</sub>OIL<sub>t</sub> + δ<sub>1</sub>OIL<sub>t−1</sub> + δ<sub>2</sub>OIL<sub>t−2</sub> + ε<sub>t</sub></div>
    </div>
  );
}

function App() {
  const minYear = RAW_DATA[0].Year;
  const maxYear = RAW_DATA[RAW_DATA.length - 1].Year;
  const [startYear, setStartYear] = useState(minYear);
  const [endYear, setEndYear] = useState(maxYear);
  const [selectedYear, setSelectedYear] = useState(2008);
  const [stage, setStage] = useState<Stage>("raw");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (selectedYear < startYear) setSelectedYear(startYear);
    if (selectedYear > endYear) setSelectedYear(endYear);
  }, [startYear, endYear, selectedYear]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setSelectedYear((year) => {
        if (year >= endYear) {
          setPlaying(false);
          return endYear;
        }
        return year + 1;
      });
    }, 850);
    return () => window.clearInterval(timer);
  }, [playing, endYear]);

  const selected = RAW_DATA.find((d) => d.Year === selectedYear) ?? RAW_DATA[0];
  const selectedIndex = RAW_DATA.findIndex((d) => d.Year === selectedYear);
  const lags = useMemo(() => {
    const get = (year: number) => RAW_DATA.find((d) => d.Year === year);
    return {
      y0: get(selectedYear), y1: get(selectedYear - 1), y2: get(selectedYear - 2),
      f3: get(selectedYear - 3), hc1: get(selectedYear - 1), oil2: get(selectedYear - 2),
    };
  }, [selectedYear]);

  const reset = () => {
    setStartYear(minYear); setEndYear(maxYear); setSelectedYear(2008); setStage("raw"); setPlaying(false);
  };

  const stageInfo = {
    raw: { title: "Actual observations in levels", body: "The field shows the reported Saudi Arabian WDI observations. Selecting a year highlights that observation and the lagged years required by the ARDL structure." },
    stationarity: { title: "Stationarity and first differences", body: "The report applies the ADF test after first differencing. All four variables are reported as I(1), so the visualization shows the transformation as a stage of the same data journey." },
    breaks: { title: "Structural-break stage", body: "Confirmed breaks are reported for GDP per capita (1999, 2019) and oil rents (2008, 2013). Fertility and schooling breakpoints are reported only as potential because their null hypotheses were not rejected." },
    ardl: { title: "Dynamic ARDL specification", body: "AIC selected ARDL(2,1,3,2) after evaluating 192 candidate models. The selected year is connected to the exact lag structure rather than a simplified 3D regression surface." },
    longrun: { title: "Long-run relationship", body: "The bounds test reports F = 5.441751, above the 5% I(1) bound of 4.306. The reported long-run coefficients are displayed symbolically in the field." },
    ecm: { title: "Short-run dynamics and ECM", body: "The reported error-correction coefficient is −1.383761 and statistically significant. The short-run coefficients remain those reported in the project, without recomputing a new model from the selected years." },
  }[stage];

  return (
    <main className="appShell">
      <section className="visualColumn">
        <header className="minimalHeader">
          <div>
            <div className="kicker">SAUDI ARABIA · UNIFIED GROWTH THEORY × ARDL</div>
            <h1>One dataset. One equation. One continuous econometric journey.</h1>
          </div>
          <div className="headerMeta">
            <span>1992–2023</span><span>ARDL(2,1,3,2)</span><span>WDI</span>
          </div>
        </header>

        <div className="fieldWrap">
          <ThreeDStage data={RAW_DATA} startYear={startYear} endYear={endYear} selectedYear={selectedYear} stage={stage} />
          <div className="stageCaption">
            <span>{stageInfo.title}</span>
            <span>Selected observation: <b>{selectedYear}</b></span>
          </div>
        </div>

        <div className="controls">
          <div className="controlTop">
            <div className="yearReadout"><span>YEAR</span><strong>{selectedYear}</strong></div>
            <div className="rangeReadout"><span>VISIBLE DATA WINDOW</span><strong>{startYear} → {endYear}</strong></div>
            <div className="actions">
              <button onClick={() => setSelectedYear(Math.max(startYear, selectedYear - 1))} aria-label="Previous year"><ChevronLeft size={16} /></button>
              <button className={playing ? "active" : ""} onClick={() => setPlaying((v) => !v)}>{playing ? <Pause size={15} /> : <Play size={15} />} {playing ? "Pause" : "Play"}</button>
              <button onClick={() => setSelectedYear(Math.min(endYear, selectedYear + 1))} aria-label="Next year"><ChevronRight size={16} /></button>
              <button onClick={reset} title="Reset"><RotateCcw size={15} /></button>
            </div>
          </div>
          <input className="yearSlider" type="range" min={startYear} max={endYear} value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} />
          <div className="rangeControls">
            <label>FROM <select value={startYear} onChange={(e) => setStartYear(Math.min(Number(e.target.value), endYear))}>{RAW_DATA.map(d => <option key={d.Year}>{d.Year}</option>)}</select></label>
            <label>TO <select value={endYear} onChange={(e) => setEndYear(Math.max(Number(e.target.value), startYear))}>{RAW_DATA.map(d => <option key={d.Year}>{d.Year}</option>)}</select></label>
          </div>
        </div>

        <div className="workflow">
          {stages.map((item, i) => (
            <button key={item.id} className={stage === item.id ? "workflowStep active" : "workflowStep"} onClick={() => setStage(item.id)}>
              <span className="stepNo">0{i + 1}</span><span><b>{item.label}</b><small>{item.sub}</small></span>
            </button>
          ))}
        </div>
      </section>

      <aside className="contextPanel">
        <div className="panelScroll">
          <div className="panelKicker">CURRENT MODEL STATE</div>
          <div className="selectedYear">{selectedYear}</div>
          <p className="contextText">{stageInfo.body}</p>

          <div className="panelSection">
            <div className="panelLabel">EXACT ARDL SPECIFICATION</div>
            <Equation />
            <p className="tinyNote">Equation shown exactly from the supplied specification. The selected year controls which actual observations and lags are highlighted. It does not re-estimate the model.</p>
          </div>

          <div className="panelSection">
            <div className="panelLabel">SELECTED OBSERVATION</div>
            <div className="obsGrid">
              <div><small>GDP per capita</small><b>{fmt(selected.gdpPerCapita, 2)}</b><em>constant 2015 US$</em></div>
              <div><small>Fertility rate</small><b>{selected.fertilityRate.toFixed(3)}</b><em>births per woman</em></div>
              <div><small>Expected schooling</small><b>{selected.expectedSchooling.toFixed(3)}</b><em>years</em></div>
              <div><small>Oil rents</small><b>{selected.oilRents.toFixed(3)}</b><em>% of GDP</em></div>
            </div>
          </div>

          <div className="panelSection">
            <div className="panelLabel">LAG INPUTS FOR t = {selectedYear}</div>
            <div className="lagList">
              <span>Y<sub>t</sub> · {lags.y0?.Year ?? "—"}</span><span>Y<sub>t−1</sub> · {lags.y1?.Year ?? "—"}</span><span>Y<sub>t−2</sub> · {lags.y2?.Year ?? "—"}</span>
              <span>FERT · {selectedYear}, {selectedYear - 1}, {selectedYear - 2}, {selectedYear - 3}</span>
              <span>HC · {selectedYear}, {selectedYear - 1}</span>
              <span>OIL · {selectedYear}, {selectedYear - 1}, {selectedYear - 2}</span>
            </div>
          </div>

          {stage === "stationarity" && <div className="panelSection"><div className="panelLabel">REPORTED ADF RESULTS</div><div className="resultList">{ADF_RESULTS.map(r => <div key={r.variable}><span>{r.variable}</span><b>{r.statistic.toFixed(3)}</b><em>p = {r.p.toFixed(4)} · {r.order}</em></div>)}</div></div>}

          {stage === "breaks" && <div className="panelSection"><div className="panelLabel">REPORTED BREAK STAGE</div><div className="resultList">{BREAKS.map(r => <div key={r.variable}><span>{r.variable}</span><b>{r.breaks.join(" · ")}</b><em>{r.confirmed ? "Confirmed" : "Potential only"}</em></div>)}</div></div>}

          {stage === "ardl" && <div className="panelSection"><div className="panelLabel">LAG SELECTION</div><div className="resultList"><div><span>Selected model</span><b>ARDL(2,1,3,2)</b><em>AIC · 192 models evaluated</em></div></div></div>}

          {stage === "longrun" && <div className="panelSection"><div className="panelLabel">REPORTED LONG-RUN COEFFICIENTS</div><div className="resultList">{LONG_RUN.map(r => <div key={r.name}><span>{r.name}</span><b>{r.coefficient > 0 ? "+" : ""}{fmt(r.coefficient, 4)}</b><em>p = {r.p.toFixed(4)}</em></div>)}</div><div className="miniResult">Bounds F = <b>{BOUNDS.f.toFixed(6)}</b> · I(1) 5% = <b>{BOUNDS.i1.toFixed(3)}</b></div></div>}

          {stage === "ecm" && <div className="panelSection"><div className="panelLabel">REPORTED ECM</div><div className="ecmValue">−1.383761</div><div className="tinyNote">The project reports a negative and statistically significant error-correction term.</div><div className="shortRunList">{SHORT_RUN.slice(0, 5).map(r => <div key={r.name}><span>{r.name}</span><b>{r.coefficient > 0 ? "+" : ""}{fmt(r.coefficient, 3)}</b></div>)}</div></div>}

          <div className="panelSection compact">
            <div className="panelLabel">MODEL CONTEXT</div>
            <div className="contextFacts"><span>Sample <b>1992–2023</b></span><span>Estimation <b>1995–2023 · 29 obs.</b></span><span>R² <b>{MODEL_STATS.r2.toFixed(4)}</b></span><span>DW <b>{MODEL_STATS.dw.toFixed(4)}</b></span></div>
          </div>

          <footer>Source: World Bank World Development Indicators and reported project econometric results. This interface visualizes the reported analysis and does not create a new estimate.</footer>
        </div>
      </aside>
    </main>
  );
}

export default App;
