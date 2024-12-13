import { Component, For } from "solid-js"
import { GithubListReposApiResult } from "."
import TablerStar from "~icons/tabler/star"

const GithubRepoListCard: Component<{ repositories: GithubListReposApiResult }> = (props) => {
  return (
    <div class="min-w-72 sm:min-w-96 bg-gray-100 px-3 rounded-lg border border-gray-300">
      <ul class="text-sm divide-y divide-gray-300">
        <For each={props.repositories}>
          {(repository) => (
            <li class="py-3">
              <a
                href={`https://github.com/${repository.full_name}`}
                target="_blank"
                class="inline-block font-semibold hover:text-sky-500 transition-colors mb-0.5"
              >
                {repository.name}
              </a>
              <div class="text-xs flex justify-between items-center">
                <p>Updated {new Date(repository.updated_at).toLocaleDateString()}</p>
                <p class="inline-flex items-center gap-1.5">
                  <TablerStar class="text-sm text-gray-500" /> {repository.stargazers_count}
                </p>
              </div>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}

export default GithubRepoListCard
