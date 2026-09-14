// @ts-nocheck
import svgPaths from "./svg-mfitp8dths";
import imgKokoLogo from "figma:asset/2fb784bf4eb111e438185f3f72d368e7963516ad.png";

function Container() {
  return <div className="h-[932.878px] w-[1569.586px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 1569.6 932.88\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(0 -30 -60 0 784.79 0)\\\'><stop stop-color=\\\'rgba(120,200,255,0.3)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(60,100,128,0.15)\\\' offset=\\\'0.35\\\'/><stop stop-color=\\\'rgba(0,0,0,0)\\\' offset=\\\'0.7\\\'/></radialGradient></defs></svg>')" }} />;
}

function Container1() {
  return <div className="h-[916.709px] w-[1560.28px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 1560.3 916.71\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(0 -40 -80 0 1248.2 458.35)\\\'><stop stop-color=\\\'rgba(200,150,255,0.25)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(100,75,128,0.125)\\\' offset=\\\'0.35\\\'/><stop stop-color=\\\'rgba(0,0,0,0)\\\' offset=\\\'0.7\\\'/></radialGradient></defs></svg>')" }} />;
}

function Container2() {
  return <div className="h-[952.668px] w-[1580.819px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 1580.8 952.67\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(0 -35 -70 0 316.16 762.13)\\\'><stop stop-color=\\\'rgba(150,250,200,0.2)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(75,125,100,0.1)\\\' offset=\\\'0.35\\\'/><stop stop-color=\\\'rgba(0,0,0,0)\\\' offset=\\\'0.7\\\'/></radialGradient></defs></svg>')" }} />;
}

function Container3() {
  return (
    <div className="absolute h-[906.667px] left-0 opacity-60 top-0 w-[1554.444px]" data-name="Container">
      <div className="absolute flex h-[959.342px] items-center justify-center left-[-13.96px] top-[-32.82px] w-[1585.169px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[0.971deg]">
          <Container />
        </div>
      </div>
      <div className="absolute flex h-[926.789px] items-center justify-center left-[-0.9px] top-[-6.25px] w-[1566.181px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[359.629deg]">
          <Container1 />
        </div>
      </div>
      <div className="absolute flex h-[999.437px] items-center justify-center left-[-25.24px] top-[-42.22px] w-[1608.555px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[1.711deg]">
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function KokoLogo() {
  return (
    <div className="h-[60.96px] relative shrink-0 w-[116.839px]" data-name="KOKO Logo">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-[15.18%] max-w-none size-[69.64%] top-[15.18%]" src={imgKokoLogo} />
      </div>
    </div>
  );
}

function HeaderAndP() {
  return (
    <div className="content-stretch flex flex-col gap-[7.62px] items-center leading-[0] not-italic relative shrink-0 text-center w-[281.092px]" data-name="Header and p">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[26.247px] justify-center relative shrink-0 text-[#0a0a0a] text-[25.4px] w-full">
        <p className="leading-[30.48px]">Merchant portal</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[32.173px] justify-center relative shrink-0 text-[#717182] text-[11.853px] w-full">
        <p className="leading-[16.933px]">Login and Manage your daily operations and brand growth with Koko.</p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[7.62px] items-center relative shrink-0" data-name="Header">
      <KokoLogo />
      <HeaderAndP />
    </div>
  );
}

function LabelMainContainer() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0" data-name="Label / Main - Container">
      <div className="basis-0 flex flex-col font-['Inter:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1f2937] text-[11.853px]">
        <p className="leading-[16.933px]">Username</p>
      </div>
    </div>
  );
}

function LabelTopContainer() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label / Top - Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[3.387px] py-[6.773px] relative w-full">
          <LabelMainContainer />
        </div>
      </div>
    </div>
  );
}

function ColorModifierStroke() {
  return (
    <div className="absolute inset-[0_0.14%_0_0] opacity-20 rounded-[6.773px]" data-name="ColorModifier - Stroke">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-[0.847px] border-solid inset-[-0.847px] pointer-events-none rounded-[7.62px]" />
    </div>
  );
}

function InputContainer() {
  return (
    <div className="bg-white h-[54.186px] min-h-[54.186431884765625px] relative rounded-[6.773px] shrink-0 w-full" data-name="Input - Container">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex gap-[6.773px] items-center min-h-[inherit] px-[20.32px] py-[13.547px] relative size-full">
          <ColorModifierStroke />
          <div className="basis-0 flex flex-col font-['Inter:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#717182] text-[15.24px]">
            <p className="leading-[23.707px]">Enter your username</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-1/2 top-0 translate-x-[-50%] w-[325.119px]" data-name="Text input">
      <LabelTopContainer />
      <InputContainer />
    </div>
  );
}

function UsernameInputField() {
  return (
    <div className="h-[84.666px] relative shrink-0 w-full" data-name="Username input field">
      <TextInput />
    </div>
  );
}

function LabelMainContainer1() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0" data-name="Label / Main - Container">
      <div className="basis-0 flex flex-col font-['Inter:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1f2937] text-[11.853px]">
        <p className="leading-[16.933px]">Password</p>
      </div>
    </div>
  );
}

function LabelTopContainer1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label / Top - Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[3.387px] py-[6.773px] relative w-full">
          <LabelMainContainer1 />
        </div>
      </div>
    </div>
  );
}

function ColorModifierStroke1() {
  return (
    <div className="absolute inset-[0_0.14%_0_0] opacity-20 rounded-[6.773px]" data-name="ColorModifier - Stroke">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-[0.847px] border-solid inset-[-0.847px] pointer-events-none rounded-[7.62px]" />
    </div>
  );
}

function InputContainer1() {
  return (
    <div className="bg-white h-[54.186px] min-h-[54.186431884765625px] relative rounded-[6.773px] shrink-0 w-full" data-name="Input - Container">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex gap-[6.773px] items-center min-h-[inherit] px-[20.32px] py-[13.547px] relative size-full">
          <ColorModifierStroke1 />
          <div className="basis-0 flex flex-col font-['Inter:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#717182] text-[15.24px]">
            <p className="leading-[23.707px]">Enter your password</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-1/2 top-0 translate-x-[-50%] w-[325.119px]" data-name="Text input">
      <LabelTopContainer1 />
      <InputContainer1 />
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[19.893px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.83%_8.33%_20.84%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.236 13.2609">
            <path d={svgPaths.p25267f80} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.65774" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.63098 6.63098">
            <path d={svgPaths.p36d29280} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.65774" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[296.76px] size-[19.893px] top-[47.88px]" data-name="Button">
      <Icon />
    </div>
  );
}

function UsernameInputField1() {
  return (
    <div className="h-[84.666px] relative shrink-0 w-full" data-name="Username input field">
      <TextInput1 />
      <Button />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[20.32px] items-start relative shrink-0 w-full">
      <UsernameInputField />
      <UsernameInputField1 />
    </div>
  );
}

function ColorModifier() {
  return <div className="absolute bg-[#818089] inset-0" data-name="color-modifier" />;
}

function PrimaryCta() {
  return (
    <div className="h-[54.186px] relative rounded-[6.773px] shadow-[0px_0.847px_1.693px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Primary CTA">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[6.773px] items-center justify-center px-[13.547px] py-0 relative size-full">
          <ColorModifier />
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#fffeff] text-[15.24px] text-center text-nowrap">
            <p className="leading-[15.24px]">Login</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgotPassword() {
  return (
    <div className="relative shrink-0 w-full" data-name="Forgot password">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[8.467px] relative w-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[15.24px] text-black text-center text-nowrap">
            <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[15.24px] underline">Forgot password?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewToKoko() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8.467px] relative shrink-0" data-name="New to Koko?">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[15.24px] text-black text-center text-nowrap">
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[15.24px] underline">New to Koko?</p>
      </div>
    </div>
  );
}

function Hyperlinks() {
  return (
    <div className="content-stretch flex flex-col gap-[22.86px] items-center relative shrink-0 w-[145.626px]" data-name="Hyperlinks">
      <ForgotPassword />
      <NewToKoko />
    </div>
  );
}

function LoginForm() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[28.787px] items-center left-[calc(50%+0.44px)] overflow-clip px-[54.186px] py-[22.013px] rounded-[16.933px] top-[calc(50%+0.45px)] translate-x-[-50%] translate-y-[-50%] w-[436.878px]" data-name="Login form">
      <Header />
      <Frame />
      <PrimaryCta />
      <Hyperlinks />
    </div>
  );
}

function Login() {
  return (
    <div className="h-[906.667px] overflow-clip relative shrink-0 w-full" data-name="Login" style={{ backgroundImage: "linear-gradient(149.739deg, rgb(189, 220, 238) 0%, rgb(224, 231, 255) 35%, rgb(243, 232, 255) 70%, rgb(252, 231, 243) 100%)" }}>
      <Container3 />
      <LoginForm />
    </div>
  );
}

export default function Defaulted() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Defaulted">
      <Login />
    </div>
  );
}