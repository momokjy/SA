import { Article } from "./types";

export const volume1: Article[] = [
  {
    id: "MACRO-001",
    volume: 1,
    category: "Macroeconomics",
    title: "[심층 분석] 양적긴축(QT)의 종말과 유동성 배관(Plumbing)의 역설",
    coreThesis: "대부분의 투자자는 연준의 '기준금리(Price of Money)'에만 집착한다. 하지만 자산 시장의 방향을 결정하는 진짜 엔진은 '유동성의 총량(Quantity of Money)'이다. 우리는 연준의 대차대조표와 역레포(RRP) 잔고를 해부함으로써, 진정한 피봇(Pivot)의 시점을 선취매할 것이다.",
    imageUrl: "/images/macro_liquidity_plumbing.png",
    tags: ["QT", "Liquidity", "RRP", "Fed"],
    content: `
      <h2>1. 서론: 금리 인상에도 시장이 버틴 미스터리</h2>
      <p>2023년부터 2024년까지, 연준(Fed)은 역사상 가장 가파른 속도로 기준금리를 5.5%까지 인상했고, 매월 약 950억 달러 규모의 국채와 MBS를 매각하는 강력한 <strong>양적긴축(QT)</strong>을 지속했습니다.</p>
      <p>경제 교과서대로라면 시중 유동성이 말라붙어 나스닥과 비트코인은 붕괴했어야 마땅합니다. 하지만 시장은 오히려 신고가를 경신했습니다. 이 거대한 괴리(Decoupling)를 이해하려면 연준의 대차대조표 부채(Liabilities) 항목인 <strong>'역레포(Reverse Repo)'</strong>의 작동 원리를 뜯어봐야 합니다.</p>

      <h2>2. 메커니즘 분석: 스텔스 양적완화 (Stealth QE)</h2>
      <ul>
        <li><strong>유동성의 저수지 (The Reservoir):</strong> 코로나 팬데믹 당시 연준의 무제한 돈 풀기로 시중에 현금이 넘쳐나자, 시중 은행과 머니마켓펀드(MMF)는 갈 곳 잃은 현금을 연준의 역레포(RRP) 창구에 맡겨두었습니다. 그 규모는 한때 <strong>2.5조 달러</strong>에 달했습니다. 이는 금융 시스템의 거대한 '예비 유동성 저수지'였습니다.</li>
        <li><strong>배관의 작동 원리 (The Plumbing):</strong> 연준이 QT를 통해 국채를 시장에 내다 팔면, 누군가는 현금을 주고 그 국채를 사야 합니다. 정상적인 상황이라면 시중 은행의 <strong>지급준비금(Bank Reserves)</strong>이 줄어들어 유동성 충격이 옵니다.</li>
        <li><strong>머니마켓펀드의 이동:</strong> 하지만 이번 사이클에서는 달랐습니다. MMF들이 연준 RRP에 파킹해 두었던 돈(당시 연 5.3% 수준)을 인출하여, 금리가 더 매력적으로 변한 단기 국채(T-bills)를 사들였습니다. 즉, <strong>[RRP 잔고 감소 ➔ 국채 매입 ➔ 시장 유동성 유지]</strong>라는 메커니즘이 작동했습니다.</li>
      </ul>
      <blockquote>연준이 앞문으로 돈을 빨아들였지만(QT), 뒷문으로 저수지의 물이 흘러나온(RRP Drain) 덕분에 시장은 은행 지급준비금이 줄어들지 않는 <strong>'스텔스 양적완화'</strong> 효과를 누린 것입니다.</blockquote>

      <h2>3. 리스크 시나리오: 완충재의 고갈 (The Drain)</h2>
      <ul>
        <li><strong>임계점 (The Zero Bound):</strong> 문제는 이 저수지가 무한하지 않다는 것입니다. 2.5조 달러였던 RRP 잔고는 이제 바닥(0)을 향해 가고 있습니다. 완충재가 사라지는 순간, QT의 충격은 은행 시스템의 심장인 '지급준비금'을 직접 타격하게 됩니다.</li>
        <li><strong>시스템 위기 (Repo Crisis 2.0):</strong> 지급준비금이 일정 수준(미국 GDP의 10~12% 추정) 이하로 떨어지면, 은행들은 서로에게 돈을 빌려주기를 거부합니다. 이는 2019년 9월, 단기 자금 시장 금리가 하룻밤 새 10%로 폭등했던 <strong>'레포 발작(Repo Spike)'</strong>을 재현할 수 있습니다. 이는 주식, 채권, 코인 모든 자산의 동반 투매(Fire Sale)를 부릅니다.</li>
      </ul>

      <h2>4. 투자 전략 및 대응 (Action Plan)</h2>
      <ul>
        <li><strong>진정한 피봇 (Real Pivot):</strong> 파월 의장의 "인플레이션 목표 2%" 발언은 립서비스일 뿐입니다. 금융 시스템이 붕괴될 위기(레포 발작) 앞에서는 그 어떤 중앙은행도 긴축을 지속할 수 없습니다.</li>
        <li><strong>매수 신호:</strong> RRP 잔고가 위험 수위(약 2,000억~3,000억 달러)에 도달하여 바닥을 다지는 모습이 포착되면, 연준은 반드시 QT를 중단하거나 감속(Tapering)해야 합니다.</li>
        <li><strong>Action:</strong> 이 순간이 바로 거시적 유동성 공급이 재개되는 구조적 변곡점입니다. 이때가 <strong>비트코인</strong>과 <strong>나스닥</strong> 비중을 공격적으로 늘려야 할 가장 확실한 신호탄입니다.</li>
      </ul>
    `
  },
  {
    id: "MACRO-002",
    volume: 1,
    category: "Macroeconomics",
    title: "[심층 분석] 채권 금리의 중력 법칙과 4.5% 임계점",
    coreThesis: "금리는 자산 가격의 중력이다. 특히 미 국채 10년물 금리 4.5%는 단순한 기술적 저항선이 아니라, 위험 자산의 밸류에이션 논리가 붕괴되는 '구조적 임계점(Threshold)'이다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Bond+Yield+Threshold",
    tags: ["Yield", "Valuation", "ERP", "Recession"],
    content: `
      <h2>1. 금융 공학적 원리: 할인율과 자산 가치</h2>
      <p>모든 자산의 현재 가치(P)는 미래의 현금 흐름(CF)을 금리(r)로 나눈 값입니다 ($P = \\sum CF / (1+r)^n$). 여기서 분모인 금리(r)는 <strong>무위험 수익률(Risk-Free Rate)</strong>인 미 국채 10년물 금리를 기준으로 합니다.</p>
      <ul>
        <li><strong>저금리 시대의 환상:</strong> 분모(r)가 0에 가까우면, 먼 미래에 돈을 벌 것으로 기대되는 성장주(Tech)와 꿈을 먹고 사는 암호화폐의 가치는 무한대로 발산할 수 있습니다.</li>
        <li><strong>고금리 시대의 중력:</strong> 분모(r)가 커지면, 미래 가치는 급격히 <strong>할인(Discount)</strong>되어 현재 가치가 쪼그라듭니다. 이것이 고금리가 위험 자산의 가장 큰 적(Enemy)인 이유입니다.</li>
      </ul>

      <h2>2. 4.5% 임계점: 주식 위험 프리미엄(ERP)의 소멸</h2>
      <ul>
        <li><strong>개념 정의:</strong> 투자자가 원금이 보장되는 국채 대신, 원금 손실 위험이 있는 주식이나 코인을 살 때는 <strong>'추가적인 보상(Premium)'</strong>을 요구합니다. 이를 주식 위험 프리미엄(ERP)이라고 합니다. (ERP = 주식 기대 수익률 - 국채 금리).</li>
        <li><strong>위험 구간 (The Danger Zone):</strong> 역사적으로 미 국채 10년물 금리가 <strong>4.5%</strong>를 상향 돌파하면 문제가 발생합니다. S&P 500의 기대 수익률(PER의 역수, 통상 약 5~6%)과 국채 금리(4.5%)의 차이가 1% 미만으로 좁혀지기 때문입니다.</li>
        <li><strong>기관 투자자의 심리:</strong> 수조 원을 굴리는 연기금과 기관 투자자들은 생각합니다. <strong>"가만히 있어도 4.5%를 확정적으로 주는 국채가 있는데, 왜 폭락 위험을 감수하고 주식을 사서 고작 1% 더 벌어야 하지?"</strong> 이 구간에서 거대한 자금 이동(Great Rotation)이 발생하며, 주식과 코인 시장의 <strong>밸류에이션 축소(De-rating)</strong>가 일어납니다.</li>
      </ul>

      <h2>3. 시나리오별 대응 전략</h2>
      <p>우리는 금리의 방향이 아닌 금리가 움직이는 <strong>'원인'</strong>에 배팅해야 합니다.</p>
      <ul>
        <li><strong>시나리오 A (No Landing - 나쁜 상승):</strong> 경기가 과열되어 인플레이션 우려로 금리가 4.5%를 뚫고 올라가는 경우.
          <br/>➔ <strong>대응:</strong> 위험 자산 전량 매도. <strong>현금(USD)</strong> 및 초단기채(BIL) 보유.</li>
        <li><strong>시나리오 B (Hard Landing - 나쁜 하락):</strong> 경제 위기나 신용 경색으로 금리가 급락하는 경우.
          <br/>➔ <strong>대응:</strong> <strong>미국채 장기물(TLT)</strong> 매수. (위기 초기엔 주식도 같이 빠지는 경향이 있음).</li>
        <li><strong>시나리오 C (Soft Landing/Pivot - 좋은 하락):</strong> 경기 침체 우려로 연준이 예방적 금리 인하를 시사하며 금리가 하락하는 경우.
          <br/>➔ <strong>대응:</strong> <strong>Sweet Spot.</strong> 국채 가격 상승과 유동성 공급 효과를 동시에 누리는 <strong>비트코인 & 성장주 동시 매수</strong> 구간.</li>
      </ul>
    `
  },
  {
    id: "MACRO-003",
    volume: 1,
    category: "Macroeconomics",
    title: "[비교 분석] 월가의 두 거인: JP모건 vs 모건스탠리",
    coreThesis: "시장을 보는 눈은 '매크로(Macro)'와 '마이크로(Fundamental)'로 나뉜다. 투자자는 제이미 다이먼의 경고와 마이크 윌슨의 분석 사이에서 균형을 잡아야 한다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Wall+Street+Rivalry",
    tags: ["JPMorgan", "MorganStanley", "FiscalDominance", "Earnings"],
    content: `
      <h2>1. JP모건 (Jamie Dimon): The Macro Bear</h2>
      <ul>
        <li><strong>관점 (Perspective):</strong> 제이미 다이먼은 전 세계 자금 흐름을 보는 은행가입니다. 그는 <strong>'지정학적 리스크'</strong>와 <strong>'정부 부채'</strong>에 주목합니다.</li>
        <li><strong>논리 (Fiscal Dominance):</strong> 미국 정부가 우크라이나/중동 전쟁 지원, 인프라 투자, 친환경 보조금 등으로 막대한 재정을 쓰고 있습니다. 이는 인플레이션을 구조적으로 높게(<strong>Sticky Inflation</strong>) 만듭니다.</li>
      </ul>
      <blockquote>그는 "시장은 연준이 금리를 내릴 거라 기대하지만, 재정 적자 때문에 금리는 <strong>'Higher for Longer(더 높게, 더 오래)'</strong> 유지될 수밖에 없다"고 경고합니다.</blockquote>
      <ul>
        <li><strong>투자 뷰:</strong> 경제 허리케인에 대비해 보수적으로 현금을 확보하고, 인플레이션 헷지 수단인 원자재나 에너지 섹터에 투자할 것을 권고합니다.</li>
      </ul>

      <h2>2. 모건스탠리 (Mike Wilson): The Fundamental Skeptic</h2>
      <ul>
        <li><strong>관점 (Perspective):</strong> 마이크 윌슨은 기업의 재무제표를 뜯어보는 전략가입니다. 그는 거시경제 지표보다 <strong>'영업 레버리지(Operating Leverage)'</strong>의 역습을 우려합니다.</li>
        <li><strong>논리 (Earnings Recession):</strong> 인플레이션이 높을 때는 기업이 가격을 올려 비용을 소비자에게 전가할 수 있었습니다. 하지만 인플레이션이 둔화되면 기업의 <strong>가격 결정력(Pricing Power)</strong>이 사라집니다. 매출은 정체되는데 인건비와 고정비는 그대로라면? 기업의 마진율(Margin)이 급락합니다. 이를 <strong>'이익 침체(Earnings Recession)'</strong>라고 부릅니다.</li>
        <li><strong>투자 뷰:</strong> "금리 피봇이 와도 주가는 빠질 수 있다." 단순 지수(Index) 투자를 멈추고, 확실한 현금 흐름과 해자(Moat)를 가진 <strong>퀄리티 주식(Quality Stocks)</strong>을 선별(Stock Picking)해야 합니다.</li>
      </ul>
    `
  },
  {
    id: "RISK-002",
    volume: 1,
    category: "Risk Analysis",
    title: "[현실 진단] 트럼프 2.0과 재정 우위 (Fiscal Dominance)",
    coreThesis: "트럼프의 재집권은 '가정'이 아닌 '현실'이다. 그의 경제 철학은 연준의 독립성을 위협하며, 이는 비트코인의 존재 이유를 증명하는 가장 강력한 내러티브다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Fiscal+Dominance",
    tags: ["Trump", "FiscalDominance", "Bitcoin", "Debasement"],
    content: `
      <h2>1. 현재 상황: Trumponomics 2.0</h2>
      <p>트럼프 대통령의 재집권으로 '작은 정부'와 '자유 무역'의 시대는 끝났습니다. 트럼프노믹스 2.0의 핵심은 <strong>"관세 인상, 약달러, 그리고 저금리를 통한 수출 제조업 부활"</strong>입니다. 이 목표를 달성하기 위해 가장 방해가 되는 존재는 '인플레이션을 잡기 위해 금리를 높게 유지하려는' 연준(Fed)입니다.</p>

      <h2>2. 작동 메커니즘: 재정 우위 (Fiscal Dominance)</h2>
      <ul>
        <li><strong>개념:</strong> 정상적인 국가에서는 중앙은행이 물가를 잡기 위해 금리를 올립니다(통화 우위). 하지만 정부 부채가 통제 불능 수준(GDP 대비 130% 상회)이 되면 상황이 역전됩니다.</li>
        <li><strong>역전 현상:</strong> 중앙은행이 물가 안정이 아니라, <strong>'정부의 이자 비용을 줄여주기 위해'</strong> 억지로 금리를 낮게 유지해야 하는 상황이 옵니다. 이것이 바로 <strong>재정 우위</strong>입니다.</li>
        <li><strong>갈등:</strong> 트럼프 행정부는 연준을 압박하여 금리 인하를 강요할 가능성이 높습니다. 파월 의장의 해임설이나 연준법 개정 논의가 나오는 배경입니다.</li>
      </ul>

      <h2>3. 결과: 가치 훼손 (Debasement)</h2>
      <p>정치적 압박에 의해 인플레이션이 잡히지 않았는데도 금리를 내리면 어떻게 될까요?</p>
      <ol>
        <li>시중 유동성이 폭발하며 주식과 부동산이 일시적으로 급등합니다 (Melt-up).</li>
        <li>곧바로 <strong>2차 인플레이션</strong>이 덮치며 화폐 가치가 급락합니다.</li>
        <li><strong>'달러 신뢰도 추락'</strong>으로 이어지며 국채 매도세가 이어집니다.</li>
      </ol>

      <h2>4. 비트코인 논문 (The Bitcoin Thesis): Sovereign Insurance</h2>
      <p>이 시나리오에서 비트코인은 단순한 '위험 자산(Risk-on Asset)'이 아닙니다.</p>
      <ul>
        <li><strong>Hedge:</strong> 정치 권력이 마음대로 찍어내거나 금리를 조작할 수 없는 유일한 자산입니다.</li>
        <li><strong>Status:</strong> 망가진 법정화폐 시스템과 국가 신용 리스크(Sovereign Risk)를 헤지할 수 있는 <strong>'무신뢰(Trustless) 안전자산'</strong>으로 격상됩니다.</li>
      </ul>
      <blockquote>트럼프 행정부 하에서 비트코인 전략 비축 논의가 나오는 것은, 달러 패권의 약화를 비트코인으로 방어하려는 고도의 지정학적 전략일 수 있습니다.</blockquote>
    `
  },
  {
    id: "MACRO-008",
    volume: 1,
    category: "Macroeconomics",
    title: "[백테스팅] 위기의 성격에 따른 안전자산 가이드",
    coreThesis: "'위기엔 달러'라는 말은 반은 맞고 반은 틀리다. 2008년과 2020년 위기의 성격은 정반대였으며, 승리한 자산도 달랐다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Crisis+Comparison",
    tags: ["Crisis", "Backtesting", "Gold", "Bitcoin"],
    content: `
      <h2>1. 2008년 금융위기: 디플레이션형 파산 (Deflationary Bust)</h2>
      <ul>
        <li><strong>위기의 성격:</strong> 은행이 파산하고 신용이 증발했습니다. 돈을 빌릴 수도, 갚을 수도 없는 <strong>'돈이 귀해지는 위기'</strong>였습니다.</li>
        <li><strong>자산 퍼포먼스:</strong>
          <ul>
            <li><strong>승자:</strong> <strong>현금(USD)</strong>과 <strong>미 국채(TLT)</strong>. 모든 투자자가 현금을 확보하기 위해 자산을 투매했습니다.</li>
            <li><strong>패자:</strong> 주식은 반토막 났고, <strong>금(Gold)</strong>조차 초기 유동성 확보(Margin Call) 과정에서 30% 폭락했습니다. (비트코인은 탄생 직후라 데이터 없음).</li>
          </ul>
        </li>
      </ul>

      <h2>2. 2020년 팬데믹 위기: 인플레이션형 파산 (Inflationary Bust)</h2>
      <ul>
        <li><strong>위기의 성격:</strong> 실물 경제가 멈추자 정부가 무제한으로 돈을 풀었습니다(QE). 돈이 너무 흔해져서 휴지 조각이 될 것이라는 <strong>'돈이 쓰레기가 되는 위기'</strong>였습니다.</li>
        <li><strong>자산 퍼포먼스:</strong>
          <ul>
            <li><strong>승자:</strong> <strong>비트코인</strong>과 <strong>금</strong>. 화폐 가치 하락(Debasement)을 방어하는 자산들이 폭등했습니다.</li>
            <li><strong>패자:</strong> 현금을 들고 있던 사람들은 구매력 손실이라는 보이지 않는 세금을 냈습니다.</li>
          </ul>
        </li>
      </ul>

      <h2>3. 결론: 2025년 이후의 전략</h2>
      <p>다가올 위기의 성격을 정의해야 합니다.</p>
      <ul>
        <li>만약 고금리 여파로 은행이 터지고 기업이 도산하는 <strong>'침체(Recession)'</strong>라면? ➔ <strong>미 국채(TLT)</strong>를 사야 합니다.</li>
        <li>만약 트럼프 행정부의 재정 확대와 연준의 항복으로 인한 <strong>'화폐 신뢰 붕괴(Debasement)'</strong>라면? ➔ <strong>비트코인</strong>을 사야 합니다. 현재 매크로 환경은 후자의 가능성을 더 높게 가리키고 있습니다.</li>
      </ul>
    `
  }
];
