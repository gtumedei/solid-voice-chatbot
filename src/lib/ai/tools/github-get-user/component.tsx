import { Component } from "solid-js"
import { useChat } from "~/lib/ai"
import TablerArrowRight from "~icons/tabler/arrow-right"
import TablerBrandGithub from "~icons/tabler/brand-github"
import TablerCodeDots from "~icons/tabler/code-dots"
import TablerMapPin from "~icons/tabler/map-pin"
import TablerWorld from "~icons/tabler/world"
import { GithubUserApiResult } from "."

const GithubUserCard: Component<{ user: GithubUserApiResult }> = (props) => {
  const { setInput, handleSubmit } = useChat()

  return (
    <>
      <div class="min-w-72 sm:min-w-96 bg-gray-100 py-3 pl-3 pr-6 rounded-lg border border-gray-300">
        <div class="flex gap-4">
          {props.user.avatar_url ? (
            <img
              src={props.user.avatar_url}
              alt="Avatar"
              class="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div class="h-11 w-11 flex justify-center items-center rounded-full bg-sky-300 text-sky-800">
              {props.user.login[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p class="font-semibold">{props.user.name}</p>
            <p class="text-sm text-gray-500">{props.user.login}</p>
            {props.user.bio && <p class="text-sm mt-2">{props.user.bio}</p>}
          </div>
        </div>
        <ul class="flex flex-col gap-2 pt-3">
          <li class="flex gap-2 items-center">
            <TablerCodeDots class="text-gray-500" />
            <span class="text-sm">{props.user.public_repos} repositories</span>
          </li>
          {props.user.location && (
            <li class="flex gap-2 items-center">
              <TablerMapPin class="text-gray-500" />
              <span class="text-sm">{props.user.location}</span>
            </li>
          )}
          <li class="flex gap-2 items-center">
            <TablerBrandGithub class="text-gray-500" />
            <a
              href={props.user.html_url}
              target="_blank"
              class="text-sm hover:text-sky-500 transition-colors"
            >
              GitHub page
            </a>
          </li>
          {props.user.blog && (
            <li class="flex gap-2 items-center">
              <TablerWorld class="text-gray-500" />
              <a
                href={props.user.blog}
                target="_blank"
                class="text-sm hover:text-sky-500 transition-colors"
              >
                Personal website
              </a>
            </li>
          )}
        </ul>
      </div>
      <div class="flex flex-col gap-2 mt-3">
        <button
          class="inline-flex items-center gap-2 text-sm font-semibold text-left hover:text-sky-500 transition-colors"
          onClick={() => {
            setInput("Can you list his repositories?")
            handleSubmit()
          }}
        >
          <TablerArrowRight class="text-base text-gray-500" /> Can you list his repositories?
        </button>
      </div>
    </>
  )
}

export default GithubUserCard
