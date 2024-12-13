import { Component } from "solid-js"
import { GithubRepoApiResult } from "."
import TablerBracketsAngle from "~icons/tabler/brackets-angle"
import TablerCircleDot from "~icons/tabler/circle-dot"
import TablerStar from "~icons/tabler/star"
import TablerCalendarEvent from "~icons/tabler/calendar-event"

const GithubRepoCard: Component<{ repository: GithubRepoApiResult }> = (props) => {
  return (
    <div class="min-w-72 sm:min-w-96 bg-gray-100 p-3 pr-6 rounded-lg border border-gray-300">
      <a
        href={`https://github.com/${props.repository.full_name}`}
        target="_blank"
        class="inline-block font-semibold hover:text-sky-500 transition-colors mb-0.5"
      >
        {props.repository.name}
      </a>
      <p class="text-sm text-gray-500">{props.repository.description}</p>
      <ul class="flex flex-col gap-2 pt-3">
        <li class="flex gap-2 items-center">
          <TablerBracketsAngle class="text-gray-500" />
          <span class="text-sm">
            Language: <span class="font-medium">{props.repository.language}</span>
          </span>
        </li>
        <li class="flex gap-2 items-center">
          <TablerStar class="text-gray-500" />
          <span class="text-sm">
            Stars: <span class="font-medium">{props.repository.stargazers_count}</span>
          </span>
        </li>
        <li class="flex gap-2 items-center">
          <TablerCircleDot class="text-gray-500" />
          <span class="text-sm">
            Open issues: <span class="font-medium">{props.repository.open_issues_count}</span>
          </span>
        </li>
        <li class="flex gap-2">
          <TablerCalendarEvent class="text-gray-500" />
          <div class="text-sm space-y-0.5">
            <p>
              Created:
              <span class="font-medium">
                {new Date(props.repository.created_at).toLocaleDateString()}
              </span>
            </p>
            <p>
              Updated:
              <span class="font-medium">
                {new Date(props.repository.updated_at).toLocaleDateString()}
              </span>
            </p>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default GithubRepoCard
