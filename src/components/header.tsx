import { A } from "@solidjs/router"
import { css } from "vite-plugin-inline-css-modules"

const Header = () => {
  return (
    <header class="flex px-6 py-3 border-b border-black/10 relative">
      <nav class="mx-auto">
        <ul class="flex">
          <li>
            <A href="/" end class={classes.navLink} activeClass={classes.navLinkActive}>
              Home
            </A>
          </li>
          <li>
            <A href="/chat" class={classes.navLink} activeClass={classes.navLinkActive}>
              Chat
            </A>
          </li>
        </ul>
      </nav>
      <span
        class="text-xs font-bold uppercase rounded px-2 py-1 absolute-center-y right-6"
        classList={{
          "bg-amber-100 text-amber-800": import.meta.env.DEV,
          "bg-emerald-100 text-emerald-800": !import.meta.env.DEV,
        }}
      >
        {import.meta.env.DEV ? "dev" : "prod"}
      </span>
    </header>
  )
}

const classes = css`
  .navLink {
    @apply inline-flex text-sm font-medium px-3 relative;

    &::after {
      @apply [content:''] absolute -bottom-[14px] inset-x-0 h-0.5;
    }
  }

  .navLinkActive::after {
    @apply bg-sky-600;
  }
`

export default Header
