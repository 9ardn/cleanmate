/* app.jsx — Wires all screens into the design canvas with iOS frames + Tweaks */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "state": "ok",
  "score": 70,
  "pose": "idle",
  "theme": "warm"
}/*EDITMODE-END*/;

function CleanMateApp() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const state = tweaks.state;
  const score = tweaks.score;
  const pose = tweaks.pose;

  const nav = (id) => {/* design canvas displays all screens, nav is decorative */};

  return (
    <>
      <DesignCanvas>
        <DCSection id="hero" title="CleanMate" subtitle="동거인 상호 인증 청소 게이미피케이션 · 9 screens · iOS">
          <DCArtboard id="home" label="01 · 메인 (내 방)" width={402} height={874}>
            <IOSDevice><HomeScreen state={state} score={score} pose={pose} onNavigate={nav}/></IOSDevice>
          </DCArtboard>
          <DCArtboard id="tasks" label="02 · 오늘의 할 일" width={402} height={874}>
            <IOSDevice><TasksScreen onNavigate={nav}/></IOSDevice>
          </DCArtboard>
          <DCArtboard id="detail" label="03 · 청소 항목 상세" width={402} height={874}>
            <IOSDevice><TaskDetailScreen onNavigate={nav}/></IOSDevice>
          </DCArtboard>
        </DCSection>

        <DCSection id="verify" title="상호 인증 플로우" subtitle="셀프 체크 불가 — 파트너가 봐야 점수 인정">
          <DCArtboard id="camera" label="04 · 인증 카메라" width={402} height={874}>
            <IOSDevice dark><CameraScreen onNavigate={nav}/></IOSDevice>
          </DCArtboard>
          <DCArtboard id="partner-verify" label="05 · 파트너 검증" width={402} height={874}>
            <IOSDevice><PartnerVerifyScreen onNavigate={nav}/></IOSDevice>
          </DCArtboard>
        </DCSection>

        <DCSection id="game" title="게이미피케이션" subtitle="듀오링고식 점수 / 랭크 / 스트릭">
          <DCArtboard id="leaderboard" label="06 · 리더보드 + 스트릭" width={402} height={874}>
            <IOSDevice><LeaderboardScreen onNavigate={nav}/></IOSDevice>
          </DCArtboard>
          <DCArtboard id="party" label="07 · 파티 / 룸 관리" width={402} height={874}>
            <IOSDevice><PartyScreen onNavigate={nav}/></IOSDevice>
          </DCArtboard>
        </DCSection>

        <DCSection id="meta" title="온보딩 + 프로필">
          <DCArtboard id="onboarding" label="08 · 온보딩 (파트너 초대)" width={402} height={874}>
            <IOSDevice><OnboardingScreen onNavigate={nav}/></IOSDevice>
          </DCArtboard>
          <DCArtboard id="profile" label="09 · 프로필 / 통계" width={402} height={874}>
            <IOSDevice><ProfileScreen onNavigate={nav}/></IOSDevice>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="CleanMate Tweaks">
        <TweakSection title="청결도 상태" subtitle="모든 화면의 캐릭터·방·먼지에 반영">
          <TweakRadio
            value={state}
            onChange={(v) => {
              const scoreMap = { clean: 92, ok: 70, dirty: 38, critical: 12 };
              setTweak({ state: v, score: scoreMap[v] });
            }}
            options={[
              { value: 'clean', label: '쾌적' },
              { value: 'ok', label: '양호' },
              { value: 'dirty', label: '주의' },
              { value: 'critical', label: '심각' },
            ]}
          />
        </TweakSection>
        <TweakSection title="청결도 점수" subtitle="0–100 · 바와 캐릭터 표정에 반영">
          <TweakSlider
            value={score}
            onChange={(v) => {
              let s = 'clean';
              if (v < 25) s = 'critical';
              else if (v < 50) s = 'dirty';
              else if (v < 80) s = 'ok';
              setTweak({ score: v, state: s });
            }}
            min={0} max={100} step={1}
          />
        </TweakSection>
        <TweakSection title="캐릭터 포즈">
          <TweakRadio
            value={pose}
            onChange={(v) => setTweak('pose', v)}
            options={[
              { value: 'idle', label: '기본' },
              { value: 'cleaning', label: '청소 중' },
              { value: 'wave', label: '인사' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CleanMateApp/>);
