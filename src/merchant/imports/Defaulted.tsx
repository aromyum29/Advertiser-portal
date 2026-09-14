// @ts-nocheck
import svgPaths from "./svg-glc38m7tx6";
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
    <div className="h-[67.395px] relative shrink-0 w-[129.174px]" data-name="KOKO Logo">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-[15.18%] max-w-none size-[69.64%] top-[15.18%]" src={imgKokoLogo} />
      </div>
    </div>
  );
}

function HeaderAndP() {
  return (
    <div className="content-stretch flex flex-col gap-[8.424px] items-center leading-[0] not-italic relative shrink-0 text-center w-[310.767px]" data-name="Header and p">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[29.017px] justify-center relative shrink-0 text-[#0a0a0a] text-[28.081px] w-full">
        <p className="leading-[33.698px]">Merchant portal</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[35.57px] justify-center relative shrink-0 text-[#717182] text-[13.105px] w-full">
        <p className="leading-[18.721px]">Login and Manage your daily operations and brand growth with Koko.</p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[8.424px] items-center relative shrink-0" data-name="Header">
      <KokoLogo />
      <HeaderAndP />
    </div>
  );
}

function LabelMainContainer() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0" data-name="Label / Main - Container">
      <div className="basis-0 flex flex-col font-['Inter:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1f2937] text-[13.105px]">
        <p className="leading-[18.721px]">Username</p>
      </div>
    </div>
  );
}

function LabelTopContainer() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label / Top - Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[3.744px] py-[7.488px] relative w-full">
          <LabelMainContainer />
        </div>
      </div>
    </div>
  );
}

function ColorModifierStroke() {
  return (
    <div className="absolute inset-[0_0.14%_0_0] opacity-20 rounded-[7.488px]" data-name="ColorModifier - Stroke">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-[0.936px] border-solid inset-[-0.936px] pointer-events-none rounded-[8.424px]" />
    </div>
  );
}

function InputContainer() {
  return (
    <div className="bg-white h-[59.907px] min-h-[59.906978607177734px] relative rounded-[7.488px] shrink-0 w-full" data-name="Input - Container">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex gap-[7.488px] items-center min-h-[inherit] px-[22.465px] py-[14.977px] relative size-full">
          <ColorModifierStroke />
          <div className="basis-0 flex flex-col font-['Inter:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#717182] text-[16.849px]">
            <p className="leading-[26.209px]">Enter your username</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-1/2 top-0 translate-x-[-50%] w-[359.442px]" data-name="Text input">
      <LabelTopContainer />
      <InputContainer />
    </div>
  );
}

function UsernameInputField() {
  return (
    <div className="h-[93.605px] relative shrink-0 w-full" data-name="Username input field">
      <TextInput />
    </div>
  );
}

function LabelMainContainer1() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0" data-name="Label / Main - Container">
      <div className="basis-0 flex flex-col font-['Inter:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1f2937] text-[13.105px]">
        <p className="leading-[18.721px]">Password</p>
      </div>
    </div>
  );
}

function LabelTopContainer1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label / Top - Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[3.744px] py-[7.488px] relative w-full">
          <LabelMainContainer1 />
        </div>
      </div>
    </div>
  );
}

function ColorModifierStroke1() {
  return (
    <div className="absolute inset-[0_0.14%_0_0] opacity-20 rounded-[7.488px]" data-name="ColorModifier - Stroke">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-[0.936px] border-solid inset-[-0.936px] pointer-events-none rounded-[8.424px]" />
    </div>
  );
}

function InputContainer1() {
  return (
    <div className="bg-white h-[59.907px] min-h-[59.906978607177734px] relative rounded-[7.488px] shrink-0 w-full" data-name="Input - Container">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex gap-[7.488px] items-center min-h-[inherit] px-[22.465px] py-[14.977px] relative size-full">
          <ColorModifierStroke1 />
          <div className="basis-0 flex flex-col font-['Inter:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#717182] text-[16.849px]">
            <p className="leading-[26.209px]">Enter your password</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-1/2 top-0 translate-x-[-50%] w-[359.442px]" data-name="Text input">
      <LabelTopContainer1 />
      <InputContainer1 />
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[21.993px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.84%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1612 14.6609">
            <path d={svgPaths.p2b5b300} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83275" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.33102 7.33102">
            <path d={svgPaths.p2a5b7cf0} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83275" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[328.09px] size-[21.993px] top-[52.94px]" data-name="Button">
      <Icon />
    </div>
  );
}

function UsernameInputField1() {
  return (
    <div className="h-[93.605px] relative shrink-0 w-full" data-name="Username input field">
      <TextInput1 />
      <Button />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[22.465px] items-start relative shrink-0 w-full">
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
    <div className="h-[59.907px] relative rounded-[7.488px] shadow-[0px_0.936px_1.872px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Primary CTA">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[7.488px] items-center justify-center px-[14.977px] py-0 relative size-full">
          <ColorModifier />
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#fffeff] text-[16.849px] text-center text-nowrap">
            <p className="leading-[16.849px]">Login</p>
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
        <div className="content-stretch flex items-center justify-center p-[9.36px] relative w-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16.849px] text-black text-center text-nowrap">
            <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[16.849px] underline">Forgot password?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewToKoko() {
  return (
    <div className="content-stretch flex items-center justify-center p-[9.36px] relative shrink-0" data-name="New to Koko?">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16.849px] text-black text-center text-nowrap">
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[16.849px] underline">New to Koko?</p>
      </div>
    </div>
  );
}

function Hyperlinks() {
  return (
    <div className="content-stretch flex flex-col gap-[25.273px] items-center relative shrink-0 w-[161px]" data-name="Hyperlinks">
      <ForgotPassword />
      <NewToKoko />
    </div>
  );
}

function LoginForm() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[31.826px] items-center left-[calc(50%+2.5px)] overflow-clip px-[59.907px] py-[24.337px] rounded-[18.721px] top-[calc(50%+4.31px)] translate-x-[-50%] translate-y-[-50%] w-[483px]" data-name="Login form">
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