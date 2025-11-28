import { Article } from "./types";

export const volume5: Article[] = [
  {
    id: "TECH-001",
    volume: 5,
    category: "Blockchain Architecture",
    title: "[심층 분석] 이더리움 vs 솔라나: 블록체인 아키텍처 전쟁",
    coreThesis: "블록체인의 영원한 난제인 '트릴레마(보안성, 탈중앙화, 확장성)'를 해결하기 위해 두 진영은 서로 다른 철학적 접근을 택했다. '나누어서 정복할 것인가(Modular)' 아니면 '하나의 초고속 슈퍼컴퓨터가 될 것인가(Monolithic)'. 이는 안드로이드와 iOS의 대결과 같다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Ethereum+vs+Solana",
    tags: ["Ethereum", "Solana", "Modular", "Monolithic"],
    content: `
      <h2>1. 이더리움 (모듈러 접근 방식): 분업화의 미학</h2>
      <ul>
        <li><strong>철학:</strong> "혼자서 다 할 수 없다." 비탈릭 부테린은 이더리움 메인넷(L1)이 모든 트랜잭션을 처리하는 것은 불가능하다고 판단했습니다. 그래서 L1은 가장 중요한 <strong>'보안(Security)'</strong>과 <strong>'데이터 가용성(Data Availability)'</strong>만 담당하고, 복잡한 연산과 실행은 <strong>레이어 2(아비트럼, 옵티미즘, 스타크넷 등)</strong>에 외주를 줍니다.</li>
        <li><strong>장점:</strong> 전 세계 수만 개의 노드가 검증하므로 보안성이 압도적이며, 롤업 기술을 통해 이론상 무한한 확장이 가능합니다.</li>
        <li><strong>치명적 단점 (파편화 - Fragmentation):</strong> 생태계가 쪼개집니다. 아비트럼에 있는 자산을 옵티미즘으로 옮기려면 복잡하고 보안이 취약한 '브릿지(Bridge)'를 거쳐야 합니다. 사용자 경험(UX)이 끊기고 유동성이 분산되는 것이 치명적 약점입니다.</li>
      </ul>

      <h2>2. 솔라나 (모놀리식 접근 방식): 통합의 미학</h2>
      <ul>
        <li><strong>철학:</strong> "하나의 거대한 글로벌 슈퍼컴퓨터." 솔라나는 모든 트랜잭션을 하나의 단일 체인에서 초고속으로 처리합니다. 이를 위해 <strong>'역사 증명(PoH - Proof of History)'</strong>이라는 독창적인 타임스탬프 알고리즘과 병렬 처리 기술을 도입했습니다.</li>
        <li><strong>장점:</strong> 사용자 경험이 압도적입니다. 모든 앱(DApp)이 한곳에 모여 있어, 마치 레고 블록처럼 서로 즉시 상호작용(Composability)할 수 있습니다. 속도가 빠르고 수수료가 0에 가깝습니다.</li>
        <li><strong>치명적 단점 (안정성):</strong> 엄청난 데이터를 처리하기 위해 슈퍼컴퓨터급 고성능 하드웨어가 필요하므로, 일반인은 노드 운영에 참여하기 어렵고 중앙화될 우려가 있습니다. 또한 트래픽이 폭주하면 네트워크가 멈추는(Outage) 사고가 종종 발생합니다.</li>
      </ul>

      <h2>3. 투자자의 결론</h2>
      <p>어느 한쪽이 완전히 승리하여 나머지를 없애는 구조가 아닙니다.</p>
      <ul>
        <li><strong>금융 보안이 중요한 자산(DeFi, RWA)</strong>은 이더리움으로,</li>
        <li><strong>속도와 빈번한 거래가 필요한 자산(Game, NFT, Payment)</strong>은 솔라나로 갈 것입니다.</li>
      </ul>
      <blockquote>투자자는 두 생태계의 공존 가능성에 베팅해야 합니다.</blockquote>
    `
  },
  {
    id: "TECH-002",
    volume: 5,
    category: "New Tech",
    title: "[신기술] 영지식 증명(ZK) & 스타크넷: 프라이버시와 속도의 정점",
    coreThesis: "정보를 보여주지 않고도 내가 알고 있음을 증명할 수 있는가? 알리바바 동굴의 비유로 설명되는 이 기술(ZK)은 블록체인의 두 가지 성배인 '프라이버시'와 '확장성'을 동시에 해결할 유일한 열쇠다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=ZK+Starknet",
    tags: ["ZK", "Starknet", "Privacy", "Scalability"],
    content: `
      <h2>1. 영지식 증명(Zero-Knowledge Proof)이란?</h2>
      <ul>
        <li><strong>개념:</strong> 알리바바 동굴 비유: 동굴의 문을 여는 주문을 남에게 들키지 않고, 내가 주문을 알고 있다는 사실만 증명하는 방법입니다.</li>
        <li><strong>블록체인 적용:</strong> <strong>'내 계좌 잔고와 거래 내역을 공개하지 않으면서도, 내가 정당한 소유자임'</strong>을 수학적으로 증명할 수 있습니다. 이는 투명성이 강제되는 블록체인에 '비밀(Privacy)'을 부여합니다.</li>
      </ul>

      <h2>2. 스타크넷 (The Endgame L2)</h2>
      <ul>
        <li><strong>기술적 위상:</strong> 수많은 레이어 2 솔루션 중에서도 '스타크넷(Starknet)'은 기술적 난이도가 가장 높습니다. 기존 이더리움 언어(Solidity)의 비효율성을 넘기 위해 <strong>'카이로(Cairo)'</strong>라는 독자적인 언어를 만들었습니다.</li>
        <li><strong>유효성 증명(Validity Proof)의 우월성:</strong>
          <ul>
            <li><strong>옵티미스틱 롤업(아비트럼):</strong> 거래가 사기인지 검증하기 위해 7일간의 유예 기간을 둡니다. (출금에 7일 소요).</li>
            <li><strong>ZK 롤업(스타크넷):</strong> 모든 거래를 수학적으로 압축하여 '유효성 증명'을 제출합니다. 수학적으로 참임이 증명되므로 <strong>즉시 확정(Finality)</strong>됩니다. 이것이 비탈릭 부테린이 "장기적으로 롤업은 모두 ZK로 수렴할 것"이라고 말한 이유입니다.</li>
          </ul>
        </li>
      </ul>
    `
  },
  {
    id: "VC-001",
    volume: 5,
    category: "Investment Philosophy",
    title: "[투자 철학] 피터 틸 & 파운더스 펀드: 역발상 투자론",
    coreThesis: "경쟁은 패배자들을 위한 것이다. 남들이 불가능하다고 생각하는 '0에서 1을 만드는' 하드 테크 기업에 투자하라.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Peter+Thiel+Founders+Fund",
    tags: ["PeterThiel", "FoundersFund", "HardTech", "Contrarian"],
    content: `
      <h2>1. 틸-부테린 동맹 (The Axis)</h2>
      <p>실리콘밸리의 대부이자 페이팔 창업자인 피터 틸(Peter Thiel)과 이더리움 창시자 비탈릭 부테린은 겉보기에 어울리지 않아 보입니다. 하지만 그들은 <strong>'자유지상주의(Libertarianism)'</strong>로 강력하게 연결되어 있습니다. 그들의 공통된 적은 '비효율적이고 개인의 자유를 통제하려 드는 비대한 국가 권력'입니다.</p>

      <h2>2. 하드 테크(Hard Tech) 포트폴리오</h2>
      <p>피터 틸의 파운더스 펀드(Founders Fund)는 틱톡 같은 소셜 미디어 앱(Bits)에 투자하지 않습니다. 그들은 물리적 세계를 혁신하는 <strong>아톰(Atoms)</strong>에 투자합니다.</p>
      <ul>
        <li><strong>SpaceX:</strong> NASA가 포기한 우주 산업을 민간의 영역으로 가져와 비용을 혁신했습니다.</li>
        <li><strong>Anduril:</strong> 소프트웨어로 정의되는 현대 방산 기업으로, 국방의 효율성을 높입니다.</li>
        <li><strong>Crypto Stance:</strong> 그들은 비트코인을 단순한 투기 수단이 아니라, <strong>'금융 시스템의 하드 테크'</strong>로 정의합니다. 중앙은행의 화폐 발행 독점과 통제에서 벗어난 <strong>'검열 저항성(Censorship Resistance)'</strong> 기술이야말로 진정한 혁신이라고 믿기 때문입니다.</li>
      </ul>
    `
  },
  {
    id: "VC-002",
    volume: 5,
    category: "Hidden Gem",
    title: "[히든 젬] Clone Robotics: 휴머노이드의 진화 (생체 모방)",
    coreThesis: "로봇은 왜 인간처럼 부드럽게 움직이지 못할까? 문제는 모터다. 클론 로보틱스는 '인공 근육'으로 이 문제를 해결한다.",
    imageUrl: "https://placehold.co/1200x600/1e293b/cbd5e1?text=Clone+Robotics",
    tags: ["Robotics", "Biomimetics", "Humanoid", "Clone"],
    content: `
      <h2>1. 모터 구동의 한계</h2>
      <p>테슬라 봇(Optimus)을 포함한 대부분의 휴머노이드 로봇은 모터와 기어로 움직입니다. 이는 움직임이 딱딱하고 충격에 약하며, 인간의 손처럼 계란을 쥐거나 악수를 하는 섬세한 힘 조절(Force Control)에 한계가 있습니다.</p>

      <h2>2. 생체 모방 솔루션 (Biomimetics)</h2>
      <p>Clone Robotics는 인간의 근골격계를 그대로 모방합니다. 딱딱한 금속 뼈대 위에 유압식 펌프와 <strong>'인공 근육(Artificial Muscle)'</strong>을 부착합니다. 이를 통해 인간과 똑같은 악력과 부드러운 움직임을 구현합니다.</p>

      <h2>3. 인구 절벽의 대안</h2>
      <p>전 세계적인 노동 인구 감소(Demographic Cliff)는 피할 수 없는 미래입니다. 인간을 닮은 로봇은 선택이 아닌 필수입니다. Clone은 로봇 공학에서 가장 구현하기 어려운 <strong>'손(Hand)'</strong> 기술에서 독보적인 해자를 구축하고 있어, 향후 테슬라나 엔비디아 같은 거대 기업의 인수 대상이 될 잠재력이 큽니다.</p>
    `
  }
];
