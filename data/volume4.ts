import { Article } from "./types";

export const volume4: Article[] = [
  {
    id: "TAX-001",
    volume: 4,
    category: "Tax Strategy",
    title: "[가이드] 대한민국 투자자를 위한 실전 절세 전략: 22%의 룰과 손실 확정",
    coreThesis: "투자의 목표는 '수익'이 아니라 '세후 수익'의 극대화다. 수익을 내는 것은 기술이지만, 세금을 아끼는 것은 전략이다. 특히 한국의 '재매수 제한 없음(No Wash Sale)' 규정은 투자자가 반드시 활용해야 할 합법적 엣지(Edge)다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Tax+Strategy+Guide",
    tags: ["Tax", "Korea", "WashSale", "LossHarvesting"],
    content: `
      <h2>1. 기본 원칙: 22%의 룰과 250만 원 공제</h2>
      <p>대한민국 거주자가 해외주식(미국 주식 등) 및 암호화폐(과세 시행 시)를 매매하여 얻은 이익은 <strong>양도소득세</strong> 대상입니다.</p>
      <ul>
        <li><strong>분류 과세:</strong> 금융소득종합과세(이자, 배당 등 연 2,000만 원 초과 시 합산)와 달리, 양도소득은 금액이 얼마든 <strong>22%</strong> (지방소득세 포함) 단일 세율로 종결됩니다. 이는 고소득자에게 매우 유리한 구조입니다.</li>
        <li><strong>기본 공제:</strong> 1월 1일부터 12월 31일까지 실현한 손익을 모두 합산(통산)한 뒤, <strong>250만 원</strong>을 기본 공제해 줍니다. 즉, 연간 순수익 250만 원까지는 세금이 '0원'입니다.</li>
      </ul>

      <h2>2. 필살기: 택스 로스 하베스팅 (Tax Loss Harvesting)</h2>
      <p>대부분의 투자자는 수익 난 종목에만 집중하느라, 세금을 줄일 기회를 놓칩니다. 핵심은 <strong>'손실 확정'</strong>입니다.</p>
      <ul>
        <li><strong>시나리오:</strong> 12월 20일 기준, 당신은 테슬라(TSLA) 매도로 1,000만 원의 수익을 확정 지었고, 엔비디아(NVDA)는 -500만 원의 평가 손실을 기록하며 보유 중입니다.
          <ul>
            <li><strong>Action A (방치):</strong> 아무것도 안 하면, 1,000만 원 수익 중 250만 원 공제 후 750만 원에 대해 22% 과세됩니다. <strong>납부 세액: 165만 원.</strong></li>
            <li><strong>Action B (손실 확정):</strong> 12월 말일(결제일 기준 T+2 고려, 보통 27일경) 전에 엔비디아를 전량 매도하여 -500만 원의 손실을 실현합니다.</li>
            <li><strong>Result:</strong> 국세청은 당신의 연간 순수익을 (1,000만 - 500만) = <strong>500만 원</strong>으로 계산합니다. 여기서 250만 원을 공제하면 과세 표준은 250만 원이 됩니다. <strong>납부 세액: 55만 원.</strong></li>
            <li><strong>Benefit:</strong> 간단한 매도 버튼 클릭만으로 <strong>110만 원의 현금을 즉시 절약</strong>했습니다. 이는 수익률로 따지면 엄청난 수치입니다.</li>
          </ul>
        </li>
      </ul>

      <h2>3. 한국 시장만의 특권: 워시 세일(Wash Sale) 룰 부재</h2>
      <ul>
        <li><strong>미국의 경우:</strong> 미국 국세청(IRS)은 세금 회피를 막기 위해, 손실 확정 매도 후 30일 이내에 동일 종목을 재매수하면 손실을 인정해 주지 않습니다. 이를 '워시 세일 룰'이라고 합니다.</li>
        <li><strong>한국의 경우:</strong> <strong>아직 이 규정이 없습니다.</strong> 즉, 당신은 12월 27일에 엔비디아를 팔아서 손실을 확정 짓고, <strong>1분 뒤에 다시 엔비디아를 사도 됩니다.</strong></li>
        <li><strong>전략적 함의:</strong> 포트폴리오의 수량과 비중은 그대로 유지하면서(Market Exposure 유지), 장부상 이익만 줄여 세금을 아끼는 완벽한 전략이 가능합니다. 이 구멍(Loophole)이 막히기 전까지 반드시 활용해야 합니다.</li>
      </ul>

      <h2>4. 주의사항: 취득가액 산정 (선입선출 vs 이동평균)</h2>
      <ul>
        <li><strong>리스크:</strong> 해외 거래소나 개인 지갑을 사용할 때, 국세청 신고 시 기본값은 <strong>'선입선출법(FIFO)'</strong>입니다. 즉, "가장 먼저 산 코인이 가장 먼저 팔렸다"고 가정합니다. 만약 당신이 2017년에 비트코인을 100만 원에 샀고, 최근 1억 원에 샀다면, 지금 1개를 팔 때 FIFO를 적용하면 차익이 9,900만 원이 되어 세금 폭탄을 맞습니다.</li>
        <li><strong>대응:</strong> 반드시 <strong>'이동평균법(평단가 기준)'</strong>으로 계산하여 신고하고, 이를 증빙할 엑셀 데이터나 거래소 리포트를 준비해야 합니다.</li>
      </ul>
    `
  },
  {
    id: "LIFE-001",
    volume: 4,
    category: "Philosophy",
    title: "[철학] 일산 커피 로드 & 변수 통제론 (Variable Control)",
    coreThesis: "투자는 불확실성(Uncertainty)을 다루는 게임이고, 커피 추출은 변수(Variable)를 다루는 과학이다. 이 둘의 본질은 '통제 가능한 변수를 조절하여 최적의 수율(Yield/Profit)을 뽑아내는 것'으로 완벽하게 동일하다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Coffee+Investing+Philosophy",
    tags: ["Coffee", "Philosophy", "VariableControl", "Investing"],
    content: `
      <h2>1. 변수 통제론: 바리스타와 트레이더의 공통점</h2>
      <p>맛있는 커피 한 잔을 내리기 위해 바리스타가 조절하는 변수들은, 성공적인 투자를 위해 트레이더가 조절하는 변수들과 놀라울 정도로 1:1 대응됩니다.</p>

      <h3>변수 1: 분쇄도 (Grind Size) = 레버리지 (Leverage)</h3>
      <ul>
        <li><strong>Coffee:</strong> 원두를 너무 곱게 갈면(Fine), 물이 통과하지 못해 쓴맛과 떫은맛만 남는 <strong>'과다 추출(Over-extraction)'</strong>이 일어납니다.</li>
        <li><strong>Investment:</strong> 투자에서 레버리지를 너무 높게 쓰면(High Leverage), 시장의 작은 노이즈(변동성)에도 포지션이 꽉 막혀 <strong>'청산(Liquidation)'</strong>을 당합니다. 계좌가 쓴맛을 보게 됩니다.</li>
        <li><strong>Lesson:</strong> 초보자는 굵은 분쇄도(저배율 혹은 현물)로 시작해 재료 본연의 맛을 느끼는 훈련부터 해야 합니다.</li>
      </ul>

      <h3>변수 2: 물의 온도 (Temperature) = 시장 심리 (Sentiment)</h3>
      <ul>
        <li><strong>Coffee:</strong> 약배전 원두(화려한 향미)는 93도 이상의 뜨거운 물에서 추출해야 맛이 살아나고, 강배전 원두(묵직한 맛)는 85도의 낮은 물에서 추출해야 쓴맛을 억제할 수 있습니다.</li>
        <li><strong>Investment:</strong> 시장이 뜨거운 <strong>'불장(High Temp)'</strong>일 때는 과다하게 돌파 매매나 성장주(약배전)를 공략해야 수익이 터집니다. 반면, 시장이 차갑게 식은 <strong>'하락장(Low Temp)'</strong>일 때는 보수적인 가치주나 배당주(강배전)를 천천히 적립해야 합니다. 온도를 거스르는 추출은 맛을 망칩니다.</li>
      </ul>

      <h3>변수 3: 추출 시간 (Time) = 보유 기간 (Holding Period)</h3>
      <ul>
        <li><strong>Coffee:</strong> 에스프레소는 '골든 타임(25~30초)'을 넘기면 급격히 맛이 없어집니다. "조금만 더 뽑으면 양이 많아지겠지"라는 욕심에 계속 추출하면, 결국 잡미와 나무 맛까지 다 섞여 나옵니다.</li>
        <li><strong>Investment:</strong> 추세가 꺾였는데도 "본전 올 때까지"라며 버티는 것(존버)은 과다 추출과 같습니다. 수익은 손실로 변하고, 기회비용이라는 잡미만 늘어납니다. <strong>"익절은 타이밍이고, 손절은 호흡이다."</strong> 클린 컵(확정 수익)을 위해 끊을 줄 아는 결단력이 필요합니다.</li>
      </ul>

      <h2>2. 일산의 커피 명소와 투자 스타일 (Entities)</h2>
      <p>일산은 대한민국 스페셜티 커피의 격전지입니다. 각 카페의 스타일은 특정 투자 전략을 대변합니다.</p>
      <ul>
        <li><strong>올댓커피 (All That Coffee):</strong> 김소준 바리스타의 본진. 클래식한 에스프레소와 바게트. 유행을 타지 않는 <strong>'본질 가치 투자(Fundamental Investing)'</strong>의 정석입니다.</li>
        <li><strong>립스터 커피 (Liebster):</strong> 유튜버 유트루의 픽. 편안함과 밸런스. 리스크를 최소화하고 꾸준한 수익을 추구하는 <strong>'자산 배분(Asset Allocation)'</strong> 스타일입니다.</li>
        <li><strong>터치 아프리카:</strong> 강렬한 직화보다는 섬세한 핸드드립. 오랜 내공이 필요한 <strong>'장기 투자(Long-term Holding)'</strong>의 맛입니다.</li>
        <li><strong>미루꾸 커피:</strong> 플랫너티 등 트렌디한 메뉴로 밤리단길을 평정. 시장의 유행을 빠르게 캐치하는 <strong>'모멘텀/트렌드 팔로잉(Trend Following)'</strong> 전략입니다.</li>
      </ul>
    `
  },
  {
    id: "REPORT-002",
    volume: 4,
    category: "Vision",
    title: "[비전] 비수탁 지갑(Non-custodial Wallet): 은행의 해체(Unbundling)",
    coreThesis: "지갑(Wallet)은 단순한 코인 보관소가 아니다. 그것은 신원, 결제, 투표 기능을 모두 흡수하며 기존 은행 앱을 대체하는 'Web3의 슈퍼 앱'이다. 금융 권력은 거대한 빌딩(Bank)에서 개인의 스마트폰 속 코드(Wallet)로 이동하고 있다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Non-Custodial+Wallet",
    tags: ["Wallet", "Web3", "Unbundling", "DeFi"],
    content: `
      <h2>1. Not Your Keys, Not Your Coins</h2>
      <p>FTX 사태 이후 증명된 단 하나의 진리는 "중앙화된 거래소(CEX)나 은행도 망할 수 있다"는 것입니다. 내 자산을 내가 직접 통제하는 <strong>'비수탁 지갑(메타마스크, 팬텀, 렛저 등)'</strong>은 선택이 아닌 필수가 되었습니다. 하지만 지갑의 효용은 보관 그 이상입니다.</p>

      <h2>2. 지갑의 3대 효용성 (Utility Trinity)</h2>
      <ul>
        <li><strong>Identity (신원 증명):</strong>
          <ul>
            <li><strong>Web2:</strong> 아이디와 비밀번호를 입력하거나, 구글/페이스북 아이디로 로그인합니다. 내 정보는 구글 서버에 있습니다.</li>
            <li><strong>Web3:</strong> "Connect Wallet" 버튼 하나로 끝납니다. 개인키 서명(Sign)을 통해 내가 나임을 증명합니다. 별도의 회원가입 없이 전 세계의 금융 서비스(DeFi), 예술품 장터(NFT), 소셜 미디어에 로그인할 수 있습니다. <strong>'자주적 신원(Self-Sovereign Identity)'</strong>의 실현입니다.</li>
          </ul>
        </li>
        <li><strong>Payment (결제 혁명):</strong>
          <ul>
            <li>은행 앱을 켜고, 공인인증서를 입력하고, 송금 버튼을 누르는 복잡한 절차가 없습니다.</li>
            <li>지갑 주소(또는 ENS 도메인)만 알면, 중개인 없이 P2P로 수십억 원을 3초 만에 전송합니다. 국경도, 영업시간도, 승인 절차도 없습니다.</li>
          </ul>
        </li>
        <li><strong>Governance (정치적 참여):</strong>
          <ul>
            <li>주식을 샀다고 주주총회에 직접 가는 사람은 드뭅니다.</li>
            <li>지갑에 거버넌스 토큰이 있으면, 집 방구석에서 안건에 투표(Vote)할 수 있습니다. 내 지갑이 곧 투표용지가 됩니다.</li>
          </ul>
        </li>
      </ul>

      <h2>3. 은행의 해체 (Unbundling the Bank)</h2>
      <p>과거에는 은행이 예금, 대출, 송금, 환전, 자산 관리를 독점했습니다(Bundling). 하지만 이제 지갑 하나만 있으면:</p>
      <ul>
        <li><strong>예금:</strong> 스테이킹(Staking)이나 렌딩 프로토콜로 이자를 받습니다.</li>
        <li><strong>환전:</strong> 유니스왑(DEX)에서 24시간 환전합니다.</li>
        <li><strong>송금:</strong> 스테이블코인으로 즉시 송금합니다.</li>
      </ul>
      <blockquote>은행이라는 거대한 중개인(Middleman)이 제공하던 서비스들이 코드 조각으로 분해되어 지갑 안으로 들어오고 있습니다. 이것이 핀테크를 넘어선 <strong>'테크핀(TechFin)'</strong>의 미래입니다.</blockquote>
    `
  }
];
