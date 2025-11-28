import { Article } from "./types";

export const volume3: Article[] = [
  {
    id: "STRAT-002",
    volume: 3,
    category: "Masterclass",
    title: "[마스터클래스] 와이코프(Wyckoff) 패턴: 세력의 심리 해부",
    coreThesis: "차트는 랜덤 워크가 아니다. 모든 급등 전에는 '매집(Accumulation)'이 있고, 급락 전에는 '분산(Distribution)'이 있다. 우리는 '스마트 머니(Composite Man)'가 대중의 공포를 이용해 물량을 뺏어가는(Shakeout) 결정적 순간을 포착해야 한다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Wyckoff+Pattern+Hero",
    tags: ["Wyckoff", "TechnicalAnalysis", "Accumulation", "Trading"],
    content: `
      <h2>1. 철학적 배경: The Composite Man</h2>
      <p>1930년대 월가의 전설 리처드 와이코프는 시장을 조작할 수 있는 막대한 자금력을 가진 가상의 인물, <strong>'Composite Man(세력)'</strong>이 존재한다고 가정했습니다. 그는 자신의 의도를 숨기려 하지만, <strong>'가격(Price)'</strong>과 <strong>'거래량(Volume)'</strong>이라는 발자국은 숨길 수 없습니다. 그는 대중이 공포에 질려 투매할 때 사고(Accumulation), 탐욕에 눈멀어 추격 매수할 때 팝니다(Distribution).</p>

      <h2>2. 국면 분석: 매집의 5단계 (Accumulation Schematic)</h2>
      <div class="my-8 rounded-xl overflow-hidden border border-protoss-accent-blue/30 shadow-lg">
        <img src="/images/wyckoff_schematic.svg" alt="Wyckoff Accumulation Schematic" class="w-full h-auto" />
      </div>
      <p>세력이 물량을 모으는 매집 과정은 철저하게 설계된 5단계 시나리오를 따릅니다.</p>
      <ul>
        <li><strong>Phase A (하락의 정지):</strong> 기존의 하락 추세가 멈추는 단계입니다.
          <ul>
            <li><strong>PS (Preliminary Support):</strong> 하락세가 처음으로 멈칫하며 매수세가 들어오는 구간.</li>
            <li><strong>SC (Selling Climax):</strong> 패닉 셀이 쏟아지며 거래량이 폭발하는 구간. 대중은 "시장이 망했다"며 던지지만, 세력은 그 물량을 받아냅니다. 변동성이 극대화됩니다.</li>
            <li><strong>AR (Automatic Rally):</strong> 매도세가 일시적으로 고갈되어 기술적으로 반등하는 구간.</li>
            <li><strong>ST (Secondary Test):</strong> SC의 저점을 다시 확인하러 내려옵니다. 이때 거래량이 SC보다 줄어야 바닥이 다져진 것입니다.</li>
          </ul>
        </li>
        <li><strong>Phase B (원인 형성 - The Cause):</strong>
          <br/>지루한 횡보장(Trading Range)이 이어집니다. 세력은 가격을 위아래로 흔들며(Choppy), 지친 개미들의 물량을 조용히 흡수합니다. 이 기간이 길수록 상승 에너지(The Effect)는 커집니다.</li>
        <li><strong>Phase C (함정 - The Spring/Shakeout): ★ KEY POINT</strong>
          <ul>
            <li><strong>The Bear Trap:</strong> 박스권 하단 지지선을 갑자기 강한 음봉으로 깨뜨립니다.</li>
            <li><strong>Psychology:</strong> 차트쟁이들은 "지지선 붕괴"를 외치며 손절(Stop Loss) 물량을 쏟아냅니다. 선물 시장의 롱 포지션이 청산됩니다.</li>
            <li><strong>Liquidity Sweep:</strong> 세력은 지지선 아래에 쌓인 이 막대한 유동성을 헐값에 쓸어 담습니다. 가격이 지지선 아래 오래 머물지 않고 V자로 급반등하면 성공적인 Spring입니다.</li>
          </ul>
        </li>
        <li><strong>Phase D (추세 전환):</strong>
          <br/>가격이 박스권 상단까지 올라갑니다. <strong>SOS (Sign of Strength)</strong>가 발생하며 거래량이 실린 양봉이 출현합니다. 저항선이 지지선으로 바뀌는 <strong>LPS (Last Point of Support)</strong>가 형성됩니다.</li>
        <li><strong>Phase E (상승 - The Effect):</strong>
          <br/>박스권을 완전히 돌파하여 신고가를 갱신하는 본격적인 상승장(Markup)입니다.</li>
      </ul>

      <h2>3. 정밀 진입 전략: 'The Test'를 노려라</h2>
      <ul>
        <li><strong>Don't Buy the Spring:</strong> Spring이 발생할 때 떨어지는 칼날을 잡지 마십시오. 그것이 진짜 하락의 시작일 수도 있습니다.</li>
        <li><strong>The Best Entry:</strong> 가격이 급반등하여 박스권 안으로 복귀(Reclaim)한 뒤, 다시 한번 지지선 근처로 눌림목을 줄 때(<strong>The Test</strong>)가 타점입니다.</li>
        <li><strong>Checklist:</strong> 이때 <strong>거래량이 현저히 말라 있어야(Dry Up)</strong> 합니다. 이는 "더 이상 팔 사람이 없다(매도세 고갈)"는 증거입니다. 손절 라인은 Spring의 최저점으로 잡으면 되므로, 손익비(R/R Ratio)가 1:10 이상 나오는 최고의 자리입니다.</li>
      </ul>
    `
  },
  {
    id: "STOCK-001",
    volume: 3,
    category: "Deep Tech",
    title: "[딥테크] Sealsq (LAES) & Y2Q (Years to Quantum)",
    coreThesis: "해커들은 지금 암호화된 데이터를 훔쳐서 저장하고 있다(Harvest Now). 양자 컴퓨터가 나오는 날(Decrypt Later)을 위해서다. Sealsq는 그 날을 대비하는 유일한 하드웨어 방패다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Sealsq+Quantum+Shield",
    tags: ["Quantum", "Cybersecurity", "Sealsq", "PQC"],
    content: `
      <h2>1. 위협 분석: Q-Day와 Harvest Now, Decrypt Later</h2>
      <ul>
        <li><strong>현재의 한계:</strong> 현재 인터넷 보안의 근간인 RSA 및 ECC 암호체계는 '소인수분해의 어려움'에 기초합니다. 슈퍼컴퓨터로도 이를 푸는 데 수억 년이 걸립니다.</li>
        <li><strong>쇼어 알고리즘 (Shor's Algorithm):</strong> 하지만 양자 컴퓨터가 상용화되면 쇼어 알고리즘을 통해 이를 수초 만에 풀 수 있습니다. 이를 <strong>'Q-Day'</strong>라고 부릅니다.</li>
        <li><strong>Harvest Now:</strong> 적대적 국가와 해커들은 지금 전 세계의 금융 정보, 군사 기밀, 비트코인 지갑 개인키 등을 암호화된 상태 그대로 훔쳐두고 있습니다. 지금은 못 풀지만, 2~5년 뒤 양자 컴퓨터가 나오면 모든 비밀이 해제되기 때문입니다.</li>
      </ul>

      <h2>2. 솔루션: 양자 내성 암호 (PQC - Post Quantum Cryptography)</h2>
      <ul>
        <li><strong>소프트웨어의 한계:</strong> 단순히 소프트웨어 패치만으로는 부족합니다. IoT 기기나 위성처럼 원격 업데이트가 어렵거나 보안이 생명인 기기는 하드웨어 레벨의 방어가 필요합니다.</li>
        <li><strong>Sealsq의 해자(Moat):</strong> Sealsq(나스닥: LAES)는 나스닥 상장사 WISeKey의 자회사로, NIST(미국표준기술연구소)가 승인한 PQC 알고리즘이 탑재된 <strong>보안 칩(Semiconductors)</strong>을 직접 설계하고 제조합니다.</li>
        <li><strong>응용 분야:</strong> 이 칩은 해킹이 불가능해야 하는 <strong>의료 기기(심장박동기), 인공위성, 스마트 미터</strong>, 그리고 <strong>암호화폐 하드월렛</strong>에 필수 부품으로 들어갑니다.</li>
      </ul>

      <h2>3. 투자 전략 (Valuation & Action)</h2>
      <ul>
        <li><strong>Risk Profile:</strong> 시가총액이 매우 작은 마이크로캡(Micro-cap) 주식으로, 하루에도 20%씩 움직이는 극심한 변동성을 보입니다. 매출이 가시화되기까지 시간이 걸리는 'J-Curve' 초기 단계입니다.</li>
        <li><strong>Execution:</strong> 절대 '몰빵' 투자는 금물입니다. 주가가 역사적 바닥권이자 기술적 지지선인 <strong>$2.50 ~ $3.50</strong> 구간에 도달했을 때만 분할 매수(Accumulation)합니다. 이 투자는 2025~2027년 양자 컴퓨터 이슈가 글로벌 헤드라인을 장식할 때 빛을 발할 것입니다.</li>
      </ul>
    `
  },
  {
    id: "STRAT-001",
    volume: 3,
    category: "Risk Analysis",
    title: "[리스크 분석] RWA 풍차 돌리기 (Recursive Leverage)의 구조적 위험",
    coreThesis: "수익률 15%의 국채 투자? 세상에 공짜 점심은 없다. 최근 유행하는 RWA 열풍 뒤에는 2008년 금융위기를 닮은 '재귀적 레버리지'라는 시한폭탄이 숨어 있다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=RWA+Leverage+Risk",
    tags: ["RWA", "DeFi", "Leverage", "Risk"],
    content: `
      <h2>1. 작동 메커니즘: The Loop</h2>
      <p>DeFi 프로토콜에서 제공하는 RWA(실물자산) 투자의 높은 수익률은 다음과 같은 '풍차 돌리기'를 통해 만들어집니다.</p>
      <ul>
        <li><strong>Step 1:</strong> 투자자가 자본금 1억 원(USDC)으로 토큰화된 미 국채(예: ONDO, stUSDT)를 매수합니다. (국채 기본 수익률 5%).</li>
        <li><strong>Step 2:</strong> 이 국채 토큰을 담보로 렌딩 프로토콜에서 8천만 원(LTV 80%)을 대출받습니다. (대출 이자 3%).</li>
        <li><strong>Step 3:</strong> 빌린 8천만 원으로 다시 국채 토큰을 매수합니다.</li>
        <li><strong>Step 4:</strong> 이 과정을 5~10회 반복(Looping)합니다.</li>
        <li><strong>Result:</strong> 내 원금은 1억이지만, 실제 굴러가는 자산은 5억 원이 됩니다. (레버리지 5배). 순수익률은 \`(5% - 3%) * 5 + 5% = 15%\`가 됩니다.</li>
      </ul>

      <h2>2. 숨겨진 위험: 연쇄 청산 (Liquidation Cascade)</h2>
      <p>이 구조는 2008년 서브프라임 모기지 사태 당시 MBS(주택저당증권) 파생상품과 구조적으로 동일합니다. '안전자산(국채)'을 담보로 과도한 빚을 냈기 때문입니다.</p>
      <ul>
        <li><strong>Risk A (Negative Carry):</strong> 디파이 대출 금리는 고정이 아닙니다. 시장 유동성이 말라 대출 금리가 3%에서 6%로 급등하면? 국채 수익률(5%)보다 이자가 더 나가면서 앉아서 원금이 녹아내립니다.</li>
        <li><strong>Risk B (De-pegging):</strong> 가장 무서운 시나리오입니다. 담보로 잡힌 국채 토큰이나 스테이블코인의 가격이 $1.00에서 $0.98로 미세하게만 하락해도, 레버리지 배수만큼 손실이 증폭됩니다. (5배 레버리지 시 2% 하락은 원금 10% 손실). 스마트 컨트랙트는 즉시 담보를 강제 매각(청산)하기 시작하고, 매도 물량이 가격을 더 떨어뜨려 <strong>'연쇄 청산(Liquidation Cascade)'</strong>을 유발합니다. 순식간에 원금이 0원이 될 수 있습니다.</li>
      </ul>

      <h2>3. 교훈 (Lesson)</h2>
      <p>높은 수익률(APY) 뒤에는 반드시 그만큼의 <strong>꼬리 위험(Tail Risk)</strong>이 숨어 있습니다. RWA 섹터에 투자할 때는 해당 프로토콜의 TVL(총 예치금) 중 얼마나 많은 비율이 이런 '레버리지 루프'에 의해 부풀려졌는지(Organic vs Looped) 반드시 체크해야 합니다.</p>
    `
  }
];
