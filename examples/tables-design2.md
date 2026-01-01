<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hourly Breakdown — Three Modern Table Designs</title>
  <style>
    :root{
      --bg0:#070A12;
      --bg1:#0B1022;
      --card: rgba(255,255,255,.06);
      --card2: rgba(255,255,255,.08);
      --stroke: rgba(255,255,255,.12);
      --stroke2: rgba(255,255,255,.16);
      --text: rgba(255,255,255,.92);
      --muted: rgba(255,255,255,.70);
      --muted2: rgba(255,255,255,.55);
      --shadow: 0 22px 70px rgba(0,0,0,.55);
      --shadow2: 0 10px 28px rgba(0,0,0,.42);
      --radius: 18px;
      --radius2: 14px;

      --good: #39d98a;
      --warn: #ffcc66;
      --bad: #ff5c7a;
      --info: #7aa7ff;

      --focus: 0 0 0 3px rgba(122,167,255,.35);
    }

    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      color:var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
      line-height: 1.5;
      background:
        radial-gradient(1200px 800px at 15% 10%, rgba(122,167,255,.18), transparent 60%),
        radial-gradient(900px 700px at 85% 15%, rgba(255,92,122,.16), transparent 55%),
        radial-gradient(1000px 800px at 55% 95%, rgba(57,217,138,.12), transparent 55%),
        linear-gradient(180deg, var(--bg0), var(--bg1));
      overflow-x:hidden;
    }

    a{color:inherit}
    .wrap{
      max-width: 1180px;
      padding: 28px 16px 64px;
      margin: 0 auto;
    }

    header{
      display:flex;
      gap:16px;
      align-items:flex-start;
      justify-content:space-between;
      margin-bottom: 22px;
    }

    .title{
      display:flex;
      flex-direction:column;
      gap:8px;
      min-width: 0;
    }

    h1{
      margin: 0;
      font-size: clamp(22px, 2.6vw, 34px);
      line-height:1.12;
      letter-spacing: -0.02em;
    }
    .subtitle{
      margin: 0;
      color: var(--muted);
      font-size: 14px;
      max-width: 76ch;
    }

    .controls{
      display:flex;
      gap:10px;
      align-items:center;
      flex-wrap:wrap;
      justify-content:flex-end;
    }

    .chip{
      display:inline-flex;
      align-items:center;
      gap:10px;
      padding: 10px 12px;
      border-radius: 999px;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.10);
      box-shadow: 0 10px 28px rgba(0,0,0,.20);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .chip strong{
      font-size: 12px;
      color: rgba(255,255,255,.80);
      font-weight: 650;
      letter-spacing: .02em;
    }
    .chip span{
      font-size: 12px;
      color: rgba(255,255,255,.70);
    }

    .btn{
      appearance:none;
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.06);
      color: var(--text);
      padding: 10px 12px;
      border-radius: 12px;
      cursor:pointer;
      transition: transform .18s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease;
      font-weight: 650;
      letter-spacing: .01em;
      font-size: 13px;
      display:inline-flex;
      align-items:center;
      gap:10px;
      user-select:none;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .btn:hover{
      transform: translateY(-1px);
      background: rgba(255,255,255,.09);
      border-color: rgba(255,255,255,.20);
      box-shadow: 0 10px 28px rgba(0,0,0,.28);
    }
    .btn:active{transform: translateY(0px) scale(.99)}
    .btn:focus-visible{outline:none; box-shadow: var(--focus), 0 10px 28px rgba(0,0,0,.28)}

    .btn .dot{
      width:8px;height:8px;border-radius:99px;background:rgba(255,255,255,.65)
    }

    .section{
      margin-top: 18px;
      padding: 18px;
      border-radius: var(--radius);
      background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.04));
      border: 1px solid rgba(255,255,255,.10);
      box-shadow: var(--shadow2);
      position:relative;
      overflow:hidden;
    }
    .section:before{
      content:"";
      position:absolute;
      inset:-2px;
      background:
        radial-gradient(800px 160px at 30% 0%, rgba(122,167,255,.18), transparent 60%),
        radial-gradient(700px 140px at 80% 0%, rgba(255,92,122,.12), transparent 60%);
      opacity:.45;
      pointer-events:none;
    }
    .section > *{position:relative}

    .section-head{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap: 14px;
      margin-bottom: 12px;
    }
    .section-title{
      margin:0;
      font-size: 16px;
      letter-spacing: -.01em;
      display:flex;
      gap:10px;
      align-items:center;
    }
    .badge{
      font-size: 11px;
      font-weight: 750;
      letter-spacing: .08em;
      text-transform: uppercase;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.16);
      background: rgba(255,255,255,.06);
      color: rgba(255,255,255,.78);
      white-space:nowrap;
    }
    .section-desc{
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 13px;
      max-width: 88ch;
    }
    .section-actions{
      display:flex;
      gap:10px;
      align-items:center;
      flex-wrap:wrap;
      justify-content:flex-end;
    }

    .table-wrap{
      margin-top: 12px;
      border-radius: var(--radius2);
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(12,16,33,.35);
      overflow:hidden;
    }

    table{
      width:100%;
      border-collapse:separate;
      border-spacing:0;
      font-variant-numeric: tabular-nums;
    }
    th,td{
      padding: 12px 12px;
      text-align:left;
      vertical-align: middle;
      border-bottom: 1px solid rgba(255,255,255,.08);
    }
    th{
      color: rgba(255,255,255,.78);
      font-size: 12px;
      letter-spacing: .06em;
      text-transform: uppercase;
      font-weight: 800;
      user-select:none;
    }
    td{
      color: rgba(255,255,255,.90);
      font-size: 14px;
      font-weight: 560;
    }
    .num{text-align:right}
    .center{text-align:center}
    .muted{color: var(--muted)}
    .small{font-size: 12px;color: var(--muted)}
    .mono{font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace}

    /* Sorting affordance */
    .sortable thead th{
      position:relative;
      cursor:pointer;
      transition: background .15s ease, color .15s ease;
    }
    .sortable thead th:hover{
      background: rgba(255,255,255,.05);
      color: rgba(255,255,255,.90);
    }
    .sort-ind{
      display:inline-flex;
      align-items:center;
      gap:8px;
    }
    .sort-arrow{
      width: 16px; height: 16px;
      display:inline-grid;
      place-items:center;
      border-radius: 6px;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.10);
      color: rgba(255,255,255,.62);
      font-size: 12px;
      transform: translateY(-.5px);
    }
    th[data-sort="asc"] .sort-arrow{color: rgba(255,255,255,.92); border-color: rgba(255,255,255,.18)}
    th[data-sort="desc"] .sort-arrow{color: rgba(255,255,255,.92); border-color: rgba(255,255,255,.18)}
    th[data-sort="asc"] .sort-arrow::before{content:"↑"}
    th[data-sort="desc"] .sort-arrow::before{content:"↓"}
    th:not([data-sort]) .sort-arrow::before{content:"↕"}

    /* TABLE 1: Glass + sticky header + zebra */
    .t1{
      background:
        radial-gradient(1200px 200px at 20% 0%, rgba(122,167,255,.10), transparent 55%),
        radial-gradient(900px 200px at 85% 0%, rgba(57,217,138,.09), transparent 60%),
        rgba(15,20,40,.20);
    }
    .t1 thead th{
      position: sticky;
      top: 0;
      z-index: 2;
      background: linear-gradient(180deg, rgba(20,26,52,.92), rgba(16,20,40,.86));
      border-bottom: 1px solid rgba(255,255,255,.10);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .t1 tbody tr:nth-child(odd) td{background: rgba(255,255,255,.02)}
    .t1 tbody tr:hover td{
      background: rgba(122,167,255,.08);
      transition: background .12s ease;
    }
    .pill{
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.06);
      font-size: 13px;
      font-weight: 700;
    }
    .pill i{
      width:8px;height:8px;border-radius:99px;background:rgba(255,255,255,.60);
      display:inline-block;
      box-shadow: 0 0 0 3px rgba(255,255,255,.06);
    }
    .pill.good i{background: rgba(57,217,138,.95)}
    .pill.warn i{background: rgba(255,204,102,.95)}
    .pill.bad i{background: rgba(255,92,122,.95)}

    /* TABLE 2: KPI heatmap + microbars */
    .t2{
      background:
        radial-gradient(1200px 260px at 25% 0%, rgba(255,92,122,.11), transparent 55%),
        radial-gradient(1000px 260px at 80% 0%, rgba(122,167,255,.11), transparent 60%),
        rgba(12,16,33,.25);
    }
    .t2 thead th{
      background: rgba(255,255,255,.04);
      border-bottom: 1px solid rgba(255,255,255,.10);
    }
    .t2 td{
      position:relative;
    }
    .kpi{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
      min-width: 0;
    }
    .kpi .val{
      font-weight: 820;
      letter-spacing: -.01em;
      white-space:nowrap;
    }
    .kpi .sub{
      font-size: 12px;
      color: rgba(255,255,255,.62);
      white-space:nowrap;
    }
    .bar{
      height: 10px;
      border-radius: 999px;
      background: rgba(255,255,255,.07);
      border: 1px solid rgba(255,255,255,.10);
      overflow:hidden;
      flex: 1 1 auto;
      min-width: 90px;
    }
    .bar > span{
      display:block;
      height:100%;
      width: 0%;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(122,167,255,.95), rgba(57,217,138,.95));
      box-shadow: 0 10px 24px rgba(122,167,255,.18);
      transition: width .8s cubic-bezier(.2,.9,.2,1);
    }
    .bar.bad > span{
      background: linear-gradient(90deg, rgba(255,204,102,.95), rgba(255,92,122,.95));
      box-shadow: 0 10px 24px rgba(255,92,122,.14);
    }
    .cell-heat{
      border-left: 1px solid rgba(255,255,255,.06);
    }
    .heat{
      position:absolute;
      inset: 0;
      opacity:.18;
      pointer-events:none;
      border-radius: 0;
    }
    .t2 tbody tr:hover .heat{opacity:.25}
    .heat.good{background: linear-gradient(90deg, rgba(57,217,138,.45), transparent 70%)}
    .heat.warn{background: linear-gradient(90deg, rgba(255,204,102,.45), transparent 70%)}
    .heat.bad{background: linear-gradient(90deg, rgba(255,92,122,.45), transparent 70%)}
    .t2 tbody tr td{background: rgba(255,255,255,.01)}
    .t2 tbody tr:hover td{background: rgba(255,255,255,.03)}

    /* TABLE 3: Responsive card-list table (mobile transforms rows into cards) */
    .t3{
      background:
        radial-gradient(1200px 240px at 20% 0%, rgba(57,217,138,.12), transparent 60%),
        radial-gradient(900px 240px at 85% 0%, rgba(255,204,102,.10), transparent 60%),
        rgba(12,16,33,.22);
    }
    .t3 thead th{
      background: rgba(255,255,255,.03);
      border-bottom: 1px solid rgba(255,255,255,.10);
    }
    .t3 td{
      border-bottom: 1px solid rgba(255,255,255,.08);
    }
    .t3 .metric{
      display:inline-flex;
      align-items:center;
      gap:10px;
      white-space:nowrap;
    }
    .icon{
      width: 26px; height: 26px;
      border-radius: 10px;
      display:grid;
      place-items:center;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.10);
      box-shadow: 0 10px 26px rgba(0,0,0,.18);
      flex: 0 0 auto;
    }
    .icon svg{width:15px;height:15px;opacity:.9}
    .t3 tbody tr:hover td{
      background: rgba(57,217,138,.06);
      transition: background .12s ease;
    }

    /* Density toggle */
    body.compact td, body.compact th{padding: 9px 10px}
    body.compact td{font-size: 13px}
    body.compact .section{padding: 16px}
    body.compact .section-desc{display:none}

    /* Responsive */
    @media (max-width: 860px){
      header{flex-direction:column; align-items:stretch}
      .controls{justify-content:flex-start}
    }

    /* Horizontal scroll helper */
    .scroll-x{
      overflow:auto;
      -webkit-overflow-scrolling: touch;
    }
    .scroll-x::-webkit-scrollbar{height:10px}
    .scroll-x::-webkit-scrollbar-thumb{
      background: rgba(255,255,255,.14);
      border-radius: 999px;
    }
    .scroll-x::-webkit-scrollbar-track{background: rgba(255,255,255,.04)}

    /* Table 3 mobile: transform to cards */
    @media (max-width: 720px){
      .t3 table, .t3 thead, .t3 tbody, .t3 th, .t3 td, .t3 tr{display:block}
      .t3 thead{display:none}
      .t3 tbody tr{
        margin: 12px 10px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.04);
        box-shadow: 0 12px 34px rgba(0,0,0,.25);
        overflow:hidden;
      }
      .t3 td{
        border:0;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap: 14px;
        padding: 12px 14px;
        border-bottom: 1px solid rgba(255,255,255,.08);
      }
      .t3 td:last-child{border-bottom:0}
      .t3 td::before{
        content: attr(data-label);
        color: rgba(255,255,255,.60);
        font-size: 11px;
        letter-spacing: .10em;
        text-transform: uppercase;
        font-weight: 850;
        flex: 1 1 auto;
      }
      .t3 td > .cell{
        display:flex;
        align-items:center;
        gap:10px;
        justify-content:flex-end;
        flex: 0 0 auto;
        text-align:right;
      }
      .t3 .metric{white-space:normal}
    }

    /* Toast */
    .toast{
      position: fixed;
      left: 50%;
      bottom: 18px;
      transform: translateX(-50%) translateY(20px);
      background: rgba(10,14,26,.75);
      border: 1px solid rgba(255,255,255,.14);
      color: rgba(255,255,255,.90);
      padding: 10px 12px;
      border-radius: 12px;
      box-shadow: 0 18px 60px rgba(0,0,0,.50);
      opacity: 0;
      pointer-events:none;
      transition: opacity .2s ease, transform .2s ease;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font-weight: 650;
      font-size: 13px;
      display:flex;
      align-items:center;
      gap:10px;
      z-index: 50;
      max-width: calc(100vw - 32px);
    }
    .toast.show{
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .toast .mark{
      width:10px;height:10px;border-radius:99px;background: rgba(57,217,138,.95);
      box-shadow: 0 0 0 3px rgba(57,217,138,.16);
      flex: 0 0 auto;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="title">
        <h1>Hourly Breakdown — Same Data, Three Modern Table Designs</h1>
        <p class="subtitle">Columns: Hour, Calls Offered, Calls Handled, SLA %, ASA, AHT, Abandon %. Click any header to sort. Use “Copy CSV” to export each table.</p>
      </div>
      <div class="controls">
        <div class="chip" role="group" aria-label="Dataset">
          <strong>Sample</strong>
          <span>9–11 AM</span>
        </div>
        <button class="btn" id="densityBtn" type="button" aria-pressed="false" title="Toggle compact density">
          <span class="dot" aria-hidden="true"></span>
          Toggle density
        </button>
      </div>
    </header>

    <!-- TABLE 1 -->
    <section class="section">
      <div class="section-head">
        <div>
          <h2 class="section-title">
            <span class="badge">Design 1</span>
            Glass table with sticky header
          </h2>
          <p class="section-desc">A clean “executive” look: sticky header for long tables, subtle zebra striping for scanability, and status pills to quickly communicate SLA performance without changing the underlying values.</p>
        </div>
        <div class="section-actions">
          <button class="btn" type="button" data-copy="#table1">
            <span class="dot" aria-hidden="true"></span>
            Copy CSV
          </button>
          <button class="btn" type="button" data-reset-sort="#table1">
            <span class="dot" aria-hidden="true"></span>
            Reset sort
          </button>
        </div>
      </div>

      <div class="table-wrap scroll-x t1">
        <table id="table1" class="sortable" aria-label="Hourly breakdown table design 1">
          <thead>
            <tr>
              <th data-type="text"><span class="sort-ind">Hour <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="number"><span class="sort-ind">Calls Offered <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="number"><span class="sort-ind">Calls Handled <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="percent"><span class="sort-ind">SLA % <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="time"><span class="sort-ind">ASA <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="time"><span class="sort-ind">AHT <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="percent"><span class="sort-ind">Abandon % <span class="sort-arrow" aria-hidden="true"></span></span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>9 AM</td>
              <td class="num">28</td>
              <td class="num">26</td>
              <td class="num"><span class="pill warn"><i aria-hidden="true"></i>85.7%</span></td>
              <td class="num mono">00:01:34</td>
              <td class="num mono">00:06:02</td>
              <td class="num">3.6%</td>
            </tr>
            <tr>
              <td>10 AM</td>
              <td class="num">41</td>
              <td class="num">38</td>
              <td class="num"><span class="pill bad"><i aria-hidden="true"></i>78.9%</span></td>
              <td class="num mono">00:02:10</td>
              <td class="num mono">00:06:45</td>
              <td class="num">6.1%</td>
            </tr>
            <tr>
              <td>11 AM</td>
              <td class="num">47</td>
              <td class="num">42</td>
              <td class="num"><span class="pill bad"><i aria-hidden="true"></i>74.0%</span></td>
              <td class="num mono">00:02:38</td>
              <td class="num mono">00:07:12</td>
              <td class="num">7.8%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- TABLE 2 -->
    <section class="section">
      <div class="section-head">
        <div>
          <h2 class="section-title">
            <span class="badge">Design 2</span>
            KPI heatmap + microbars
          </h2>
          <p class="section-desc">Built for performance monitoring: key rate columns (SLA, Abandon) get microbars and subtle heat backgrounds so you can see “how good/bad” at a glance while keeping exact numbers intact.</p>
        </div>
        <div class="section-actions">
          <button class="btn" type="button" data-copy="#table2">
            <span class="dot" aria-hidden="true"></span>
            Copy CSV
          </button>
          <button class="btn" type="button" data-reset-sort="#table2">
            <span class="dot" aria-hidden="true"></span>
            Reset sort
          </button>
        </div>
      </div>

      <div class="table-wrap scroll-x t2">
        <table id="table2" class="sortable" aria-label="Hourly breakdown table design 2">
          <thead>
            <tr>
              <th data-type="text"><span class="sort-ind">Hour <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="number"><span class="sort-ind">Calls Offered <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="number"><span class="sort-ind">Calls Handled <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="cell-heat" data-type="percent"><span class="sort-ind">SLA % <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="time"><span class="sort-ind">ASA <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="time"><span class="sort-ind">AHT <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="cell-heat" data-type="percent"><span class="sort-ind">Abandon % <span class="sort-arrow" aria-hidden="true"></span></span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>9 AM</td>
              <td class="num"><div class="kpi"><span class="val">28</span><span class="sub">offered</span></div></td>
              <td class="num"><div class="kpi"><span class="val">26</span><span class="sub">handled</span></div></td>
              <td class="cell-heat" data-heat="sla" data-value="85.7">
                <div class="heat warn"></div>
                <div class="kpi">
                  <span class="val">85.7%</span>
                  <div class="bar" aria-label="SLA bar"><span></span></div>
                </div>
              </td>
              <td class="num mono">00:01:34</td>
              <td class="num mono">00:06:02</td>
              <td class="cell-heat" data-heat="abandon" data-value="3.6">
                <div class="heat good"></div>
                <div class="kpi">
                  <span class="val">3.6%</span>
                  <div class="bar bad" aria-label="Abandon bar"><span></span></div>
                </div>
              </td>
            </tr>
            <tr>
              <td>10 AM</td>
              <td class="num"><div class="kpi"><span class="val">41</span><span class="sub">offered</span></div></td>
              <td class="num"><div class="kpi"><span class="val">38</span><span class="sub">handled</span></div></td>
              <td class="cell-heat" data-heat="sla" data-value="78.9">
                <div class="heat bad"></div>
                <div class="kpi">
                  <span class="val">78.9%</span>
                  <div class="bar" aria-label="SLA bar"><span></span></div>
                </div>
              </td>
              <td class="num mono">00:02:10</td>
              <td class="num mono">00:06:45</td>
              <td class="cell-heat" data-heat="abandon" data-value="6.1">
                <div class="heat warn"></div>
                <div class="kpi">
                  <span class="val">6.1%</span>
                  <div class="bar bad" aria-label="Abandon bar"><span></span></div>
                </div>
              </td>
            </tr>
            <tr>
              <td>11 AM</td>
              <td class="num"><div class="kpi"><span class="val">47</span><span class="sub">offered</span></div></td>
              <td class="num"><div class="kpi"><span class="val">42</span><span class="sub">handled</span></div></td>
              <td class="cell-heat" data-heat="sla" data-value="74.0">
                <div class="heat bad"></div>
                <div class="kpi">
                  <span class="val">74.0%</span>
                  <div class="bar" aria-label="SLA bar"><span></span></div>
                </div>
              </td>
              <td class="num mono">00:02:38</td>
              <td class="num mono">00:07:12</td>
              <td class="cell-heat" data-heat="abandon" data-value="7.8">
                <div class="heat bad"></div>
                <div class="kpi">
                  <span class="val">7.8%</span>
                  <div class="bar bad" aria-label="Abandon bar"><span></span></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- TABLE 3 -->
    <section class="section">
      <div class="section-head">
        <div>
          <h2 class="section-title">
            <span class="badge">Design 3</span>
            Responsive “card-list” table
          </h2>
          <p class="section-desc">Optimized for mobile: on small screens, each row becomes a readable card with label/value pairs (no sideways scrolling). On desktop, it stays a crisp table with icon-backed metric cues.</p>
        </div>
        <div class="section-actions">
          <button class="btn" type="button" data-copy="#table3">
            <span class="dot" aria-hidden="true"></span>
            Copy CSV
          </button>
          <button class="btn" type="button" data-reset-sort="#table3">
            <span class="dot" aria-hidden="true"></span>
            Reset sort
          </button>
        </div>
      </div>

      <div class="table-wrap t3">
        <table id="table3" class="sortable" aria-label="Hourly breakdown table design 3">
          <thead>
            <tr>
              <th data-type="text"><span class="sort-ind">Hour <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="number"><span class="sort-ind">Calls Offered <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="number"><span class="sort-ind">Calls Handled <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="percent"><span class="sort-ind">SLA % <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="time"><span class="sort-ind">ASA <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="time"><span class="sort-ind">AHT <span class="sort-arrow" aria-hidden="true"></span></span></th>
              <th class="num" data-type="percent"><span class="sort-ind">Abandon % <span class="sort-arrow" aria-hidden="true"></span></span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Hour"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 7v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2"/></svg>
              </span>9 AM</span></span></td>
              <td class="num" data-label="Calls Offered"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.06a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>28</span></span></td>
              <td class="num" data-label="Calls Handled"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M20 7 10 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>26</span></span></td>
              <td class="num" data-label="SLA %"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 20V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 20v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </span>85.7%</span></span></td>
              <td class="num mono" data-label="ASA"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 6v6l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2"/></svg>
              </span>00:01:34</span></span></td>
              <td class="num mono" data-label="AHT"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 3v18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </span>00:06:02</span></span></td>
              <td class="num" data-label="Abandon %"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </span>3.6%</span></span></td>
            </tr>

            <tr>
              <td data-label="Hour"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 7v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2"/></svg>
              </span>10 AM</span></span></td>
              <td class="num" data-label="Calls Offered"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.06a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>41</span></span></td>
              <td class="num" data-label="Calls Handled"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M20 7 10 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>38</span></span></td>
              <td class="num" data-label="SLA %"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 20V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 20v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </span>78.9%</span></span></td>
              <td class="num mono" data-label="ASA"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 6v6l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2"/></svg>
              </span>00:02:10</span></span></td>
              <td class="num mono" data-label="AHT"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 3v18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </span>00:06:45</span></span></td>
              <td class="num" data-label="Abandon %"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </span>6.1%</span></span></td>
            </tr>

            <tr>
              <td data-label="Hour"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 7v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2"/></svg>
              </span>11 AM</span></span></td>
              <td class="num" data-label="Calls Offered"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.06a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>47</span></span></td>
              <td class="num" data-label="Calls Handled"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M20 7 10 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>42</span></span></td>
              <td class="num" data-label="SLA %"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 20V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 20v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </span>74.0%</span></span></td>
              <td class="num mono" data-label="ASA"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 6v6l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2"/></svg>
              </span>00:02:38</span></span></td>
              <td class="num mono" data-label="AHT"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 3v18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </span>00:07:12</span></span></td>
              <td class="num" data-label="Abandon %"><span class="cell"><span class="metric"><span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </span>7.8%</span></span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true">
      <span class="mark" aria-hidden="true"></span>
      <span id="toastText">Copied</span>
    </div>
  </div>

  <script>
    (function(){
      const toast = document.getElementById('toast');
      const toastText = document.getElementById('toastText');
      let toastTimer = null;

      function showToast(msg){
        toastText.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(()=>toast.classList.remove('show'), 1400);
      }

      function parseTimeToSeconds(s){
        // Accept "HH:MM:SS" or "MM:SS"
        const parts = String(s).trim().split(':').map(Number);
        if(parts.some(n => Number.isNaN(n))) return 0;
        if(parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
        if(parts.length === 2) return parts[0]*60 + parts[1];
        return parts[0] || 0;
      }
      function parsePercent(s){
        return parseFloat(String(s).replace('%','').trim()) || 0;
      }
      function parseNumber(s){
        const n = parseFloat(String(s).replace(/,/g,'').trim());
        return Number.isFinite(n) ? n : 0;
      }
      function getCellText(td){
        // Prefer the visible numeric value inside .val, else td textContent
        const val = td.querySelector('.val');
        return (val ? val.textContent : td.textContent).trim();
      }

      function attachSorting(table){
        const thead = table.tHead;
        const tbody = table.tBodies[0];
        if(!thead || !tbody) return;

        // Store original order
        const original = Array.from(tbody.rows).map((row, idx) => ({row, idx}));
        table.__original = original;

        const headers = Array.from(thead.querySelectorAll('th'));
        headers.forEach((th, index) => {
          th.addEventListener('click', () => {
            const current = th.getAttribute('data-sort');
            const next = current === 'asc' ? 'desc' : 'asc';

            headers.forEach(h => { if(h !== th) h.removeAttribute('data-sort'); });
            th.setAttribute('data-sort', next);

            const type = th.getAttribute('data-type') || 'text';
            const rows = Array.from(tbody.rows);

            const mapped = rows.map((row) => {
              const td = row.cells[index];
              const raw = td ? getCellText(td) : '';
              let key;
              if(type === 'number') key = parseNumber(raw);
              else if(type === 'percent') key = parsePercent(raw);
              else if(type === 'time') key = parseTimeToSeconds(raw);
              else key = raw.toLowerCase();
              return {row, key};
            });

            mapped.sort((a,b) => {
              if(typeof a.key === 'number' && typeof b.key === 'number'){
                return next === 'asc' ? (a.key - b.key) : (b.key - a.key);
              }
              if(a.key < b.key) return next === 'asc' ? -1 : 1;
              if(a.key > b.key) return next === 'asc' ? 1 : -1;
              return 0;
            });

            const frag = document.createDocumentFragment();
            mapped.forEach(m => frag.appendChild(m.row));
            tbody.appendChild(frag);
          });
        });
      }

      function resetSort(table){
        const tbody = table.tBodies[0];
        if(!tbody || !table.__original) return;
        const headers = Array.from(table.tHead.querySelectorAll('th'));
        headers.forEach(h => h.removeAttribute('data-sort'));
        const frag = document.createDocumentFragment();
        table.__original
          .slice()
          .sort((a,b)=>a.idx-b.idx)
          .forEach(item => frag.appendChild(item.row));
        tbody.appendChild(frag);
      }

      function tableToCSV(table){
        const rows = Array.from(table.querySelectorAll('tr'));
        const csv = rows.map(row => {
          const cells = Array.from(row.children);
          return cells.map(cell => {
            const text = getCellText(cell).replace(/\s+/g,' ').trim();
            const escaped = '"' + text.replace(/"/g,'""') + '"';
            return escaped;
          }).join(',');
        }).join('\n');
        return csv;
      }

      async function copyText(text){
        try{
          await navigator.clipboard.writeText(text);
          return true;
        }catch(e){
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand('copy');
          document.body.removeChild(ta);
          return ok;
        }
      }

      function initHeatBars(){
        // SLA bars map 0-100; Abandon bars map 0-10 (clamped) for visibility
        const rows = document.querySelectorAll('#table2 tbody tr');
        rows.forEach(tr => {
          const slaCell = tr.querySelector('td[data-heat="sla"]');
          const abdCell = tr.querySelector('td[data-heat="abandon"]');
          if(slaCell){
            const v = parseFloat(slaCell.getAttribute('data-value')) || 0;
            const bar = slaCell.querySelector('.bar > span');
            if(bar) bar.style.width = Math.max(0, Math.min(100, v)) + '%';
          }
          if(abdCell){
            const v = parseFloat(abdCell.getAttribute('data-value')) || 0;
            const bar = abdCell.querySelector('.bar > span');
            if(bar) bar.style.width = Math.max(0, Math.min(10, v)) * 10 + '%'; // 0–10% => 0–100%
          }
        });
      }

      // Attach sorting to all sortable tables
      document.querySelectorAll('table.sortable').forEach(attachSorting);

      // Reset buttons
      document.querySelectorAll('[data-reset-sort]').forEach(btn => {
        btn.addEventListener('click', () => {
          const sel = btn.getAttribute('data-reset-sort');
          const table = document.querySelector(sel);
          if(table) resetSort(table);
          showToast('Sort reset');
        });
      });

      // Copy CSV buttons
      document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const sel = btn.getAttribute('data-copy');
          const table = document.querySelector(sel);
          if(!table) return;
          const csv = tableToCSV(table);
          const ok = await copyText(csv);
          showToast(ok ? 'Copied CSV to clipboard' : 'Copy failed');
        });
      });

      // Density toggle
      const densityBtn = document.getElementById('densityBtn');
      densityBtn.addEventListener('click', () => {
        const compact = document.body.classList.toggle('compact');
        densityBtn.setAttribute('aria-pressed', compact ? 'true' : 'false');
        showToast(compact ? 'Compact density' : 'Comfortable density');
      });

      // Heat bars animate in
      requestAnimationFrame(initHeatBars);
    })();
  </script>
</body>
</html>