import { Article } from "./types";

export const volume2: Article[] = [
  {
    id: "CRYPTO-001",
    volume: 2,
    category: "Payment Infrastructure",
    title: "[심층 분석] 결제 패권 전쟁: JPM 코인 vs XRP (구조적 해부)",
    coreThesis: "JPM 코인은 훌륭한 '인트라넷'이고, XRP는 혁명적인 '인터넷'이다. 문제의 본질은 기술이 아니라 수조 달러에 달하는 죽은 자본, '노스트로 계좌'를 누가 해방시키느냐에 있다.",
    imageUrl: "/images/jpm_vs_xrp.png",
    tags: ["JPMCoin", "XRP", "Nostro", "Liquidity"],
    content: `
      <h2>1. 보이지 않는 비용: 노스트로/보스트로 계좌 (Nostro/Vostro)</h2>
      <p>우리가 해외 송금을 할 때 며칠이 걸리고 수수료가 비싼 이유는, 비행기로 돈을 나르기 때문이 아니라 <strong>'신뢰의 비용'</strong> 때문입니다.</p>
      <ul>
        <li><strong>현황:</strong> 한국의 A은행이 미국의 B은행으로 돈을 보내려면, B은행에 개설된 A은행의 계좌(노스트로)에 미리 달러를 예치해 두어야 합니다. 신뢰하지 못하니 담보를 잡아두는 것입니다.</li>
        <li><strong>유동성의 덫 (Trapped Liquidity):</strong> 전 세계 수만 개의 은행이 서로를 믿지 못해 각자의 장부에 묶어둔 이 <strong>'사전 예치금(Pre-funding)'</strong>의 총합은 수조 달러(약 27조 달러 추산)에 달합니다. 이 돈은 대출도 못 해주고 투자도 할 수 없는, 금융 시스템의 동맥경화와 같은 <strong>'죽은 자본(Dormant Capital)'</strong>입니다. 리플(Ripple)사가 해결하고자 하는 핵심 문제는 바로 이 자본의 비효율성입니다.</li>
      </ul>

      <h2>2. 해법 A: JPM 코인 (인트라넷의 최적화)</h2>
      <ul>
        <li><strong>메커니즘:</strong> 월가의 황제 JP모건은 이 문제를 <strong>'내부화'</strong>로 해결하려 합니다. 자체 개발한 프라이빗 블록체인 '오닉스(Onyx)'를 통해, JP모건 네트워크에 가입된 은행들끼리는 공유 원장을 통해 즉시 정산합니다.</li>
        <li><strong>장점:</strong> 빠르고 안전하며 규제 친화적입니다. JP모건이라는 거대한 신용이 뒤를 받쳐줍니다.</li>
        <li><strong>치명적 한계 (Walled Garden):</strong> 이것은 <strong>'닫힌 정원'</strong>입니다. 예를 들어 신한은행이 JPM 코인을 쓰려면 JP모건의 시스템에 종속되어야 하고 고객이 되어야 합니다. 확장성은 JP모건의 고객 리스트에 국한되며, 탈중앙화의 이점은 없습니다. 애플 생태계 안에만 머물러야 하는 것과 같습니다.</li>
      </ul>

      <h2>3. 해법 B: XRP (인터넷으로의 대체)</h2>
      <ul>
        <li><strong>메커니즘 (ODL - 주문형 유동성):</strong> 리플은 은행 간의 직접 연결을 끊고 중개자가 됩니다. 송금 요청이 들어오는 그 3초의 순간에만 <strong>[원화 ➔ XRP ➔ 달러]</strong>로 변환이 일어납니다. XRP가 순간적인 유동성 가교 역할을 하는 것입니다.</li>
        <li><strong>혁명 (사전 예치금 제로):</strong> 가장 큰 혁신은 <strong>'사전 예치금이 필요 없다(Zero Pre-funding)'</strong>는 점입니다. 은행들은 노스트로 계좌에 묶여 있던 수조 달러를 해방시켜 대출이나 투자 등 수익 사업에 쓸 수 있습니다. 이는 단순한 송금 속도 개선이 아니라, 은행의 <strong>자본 효율성(Capital Efficiency)</strong>을 극대화하는 재무적 혁명입니다.</li>
      </ul>
      <blockquote>JPM 코인은 기존 시스템의 '개선(Better Horse)'이고, XRP는 시스템의 '대체(Automobile)'를 지향합니다. 국경 없는 웹3 세상의 표준 프로토콜은 폐쇄적인 인트라넷보다 개방형 인터넷이 될 가능성이 높습니다.</blockquote>
    `
  },
  {
    id: "PAY-001",
    volume: 2,
    category: "Business Model",
    title: "[비즈니스 모델] 엑솔라(Xsolla) & 비트페이(BitPay): 상인을 위한 변동성 방패",
    coreThesis: "크립토 결제의 대중화는 기술이 아니라 '리스크 전가(Risk Transfer)'에 달려 있다. 상인들은 코인을 원하지 않는다. 그들이 원하는 것은 안전한 매출이다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Payment+Shield+Illustration",
    tags: ["Xsolla", "BitPay", "Payments", "Volatility"],
    content: `
      <h2>1. 상인들의 딜레마 (The Merchant's Dilemma)</h2>
      <p>동네 빵집 주인이 비트코인 결제를 도입하지 않는 이유는 기술을 몰라서가 아닙니다. 오늘 빵을 팔아서 받은 비트코인이 내일 20% 폭락하면, 빵 재료비를 낼 수 없기 때문입니다. <strong>'가격 변동성(Volatility)'</strong>과 <strong>'세무 처리의 복잡성'</strong>은 상인들에게 수용 불가능한 리스크입니다. 이 리스크를 제거해 주는 중간 다리가 필수적입니다.</p>

      <h2>2. 엑솔라 (법적 판매자 모델 - MoR)</h2>
      <ul>
        <li><strong>타겟:</strong> 트위치(Twitch), 로블록스(Roblox), 유비소프트 등 글로벌 게임 개발사.</li>
        <li><strong>핵심 가치:</strong> 엑솔라는 단순한 결제 대행사(PG)가 아닙니다. <strong>'법적 판매자(Merchant of Record)'</strong>입니다. 한국 게임사가 브라질 유저에게 아이템을 팔 때 발생하는 복잡한 현지 세금(VAT), 환불 규정, 데이터 보호법(GDPR)을 엑솔라가 법적 주체가 되어 대신 처리합니다.</li>
        <li><strong>크립토 브릿지:</strong> 게이머는 자신이 보유한 비트코인, 이더리움, 심지어 도지코인으로 아이템을 결제합니다. 하지만 엑솔라가 중간에서 이를 처리하여, 게임 개발사에게는 깔끔하게 <strong>'달러(USD)'</strong>나 <strong>'원화(KRW)'</strong>로 정산해 줍니다. 개발자는 5%라는 높은 수수료를 지불하지만, 블록체인을 전혀 몰라도 전 세계의 가상자산 유동성을 매출로 연결할 수 있습니다. 이것이 엑솔라가 게임 결제 시장을 장악한 비결입니다.</li>
      </ul>

      <h2>3. 비트페이 (변동성 방패 - The Volatility Shield)</h2>
      <ul>
        <li><strong>타겟:</strong> 마이크로소프트, AMC 영화관, 명품 브랜드 등 일반 기업.</li>
        <li><strong>메커니즘:</strong> 소비자가 결제 QR코드를 찍고 코인을 전송하는 순간, 비트페이는 백엔드 현물 시장에서 즉시 해당 코인을 매도하여 환율을 고정(Locking)합니다.</li>
        <li><strong>효과:</strong> 상인은 코인을 만져볼 필요도 없습니다. 다음 날 은행 계좌에 약속된 법정화폐가 입금됩니다. 비트페이는 상인을 대신해 '환율 변동 리스크'를 떠안는 대가로 수수료를 받습니다.</li>
        <li><strong>알파 데이터 (LTC Dominance):</strong> 비트페이의 월간 결제 리포트를 분석해보면 흥미로운 사실이 발견됩니다. 결제 빈도에서 <strong>라이트코인(LTC)</strong>의 점유율이 비트코인(BTC)을 앞서거나 대등한 경우가 많습니다. 이는 투자자들이 비트코인을 '모아야 하는 자산(디지털 금)'으로 인식하여 소비를 꺼리는 반면(Gresham's Law), 라이트코인은 '쓰기 편한 화폐(디지털 은)'로 인식한다는 강력한 증거입니다. 결제 관련주 투자 시 반드시 참고해야 할 데이터입니다.</li>
      </ul>
    `
  },
  {
    id: "REPORT-001",
    volume: 2,
    category: "Insight",
    title: "[인사이트] FedNow vs 스테이블코인: 적이 아닌 동지",
    coreThesis: "연준의 실시간 결제 시스템 FedNow가 나오면 코인은 망할까? 아니다. FedNow는 코인 시장으로 돈이 들어오는 고속도로의 톨게이트를 24시간 열어주는 역할을 할 것이다.",
    imageUrl: "/images/fednow_vs_stablecoin.png",
    tags: ["FedNow", "Stablecoin", "OnRamp", "DeFi"],
    content: `
      <h2>1. 시장의 오해: 대체재 이론</h2>
      <p>많은 사람들이 "미국 정부가 24시간 실시간 이체가 가능한 FedNow를 출시하면, 굳이 테더(USDT)나 USDC 같은 스테이블코인을 쓸 이유가 없다"고 생각했습니다. 하지만 이는 두 시스템의 본질적 차이를 간과한 것입니다.</p>

      <h2>2. 본질적 차이: 인트라넷 vs 인터넷</h2>
      <ul>
        <li><strong>FedNow (국내용):</strong> 미국 내 은행들끼리만 연결된 내부망입니다. 한국에 있는 우리가 미국 거래소로 송금을 하거나, 아프리카의 친구에게 돈을 보낼 때 FedNow를 사용할 수 없습니다.</li>
        <li><strong>스테이블코인 (국제용):</strong> 인터넷이 연결된 곳이라면 어디든 갈 수 있는 <strong>'국경 없는 유동성'</strong>입니다. 국적과 은행 계좌 유무에 상관없이 전송이 가능합니다.</li>
      </ul>

      <h2>3. 기능적 차이: 단순 송금 vs 프로그래밍</h2>
      <ul>
        <li><strong>FedNow:</strong> 단순히 A 계좌에서 B 계좌로 달러 숫자를 옮기는 기능뿐입니다.</li>
        <li><strong>스테이블코인:</strong> <strong>'스마트 컨트랙트'</strong>가 결합된 '프로그래밍 가능한 돈(Programmable Money)'입니다. "매주 금요일에 급여의 10%를 자동으로 저축해라", "담보 가치가 떨어지면 자동으로 대출을 상환해라" 같은 복잡한 금융 로직을 수행할 수 있습니다.</li>
      </ul>

      <h2>4. 시너지 효과: 24시간 온램프(On-ramp)</h2>
      <p>FedNow의 진짜 가치는 <strong>'법정화폐 진입로의 24시간 가동'</strong>에 있습니다.</p>
      <ul>
        <li><strong>과거:</strong> 금요일 오후 5시에 은행 문이 닫히면, 월요일 아침까지 코인 거래소로 현금을 입금할 수 없었습니다. 주말에 비트코인이 폭락해서 저점 매수를 하고 싶어도 총알(현금)을 넣을 수 없었습니다.</li>
        <li><strong>미래:</strong> FedNow 덕분에 365일 24시간 언제든 달러가 거래소로 입금되어 스테이블코인으로 바뀔 수 있습니다. 이는 코인 시장의 유동성을 폭발시킬 강력한 촉매제(보완재)입니다. 따라서 FedNow의 출시는 스테이블코인의 종말이 아니라, <strong>제도권 금융과 크립토 금융의 연결</strong>을 가속화하는 호재입니다.</li>
      </ul>
    `
  }
];
