export default function LogoImage({ className = 'h-8' }) {
  return (
    <>
      <img
        src="/ref/GIF/Copy of _ANIMATED LOGO DARK RED.gif"
        alt="CI&T"
        className={`${className} dark:block hidden`}
      />
      <img
        src="/ref/GIF/Copy of _ANIMATED LOGO LIGHT BLUE.gif"
        alt="CI&T"
        className={`${className} dark:hidden block`}
      />
    </>
  )
}
