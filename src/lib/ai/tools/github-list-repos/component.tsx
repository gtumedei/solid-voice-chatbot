import { Component } from "solid-js"
import { GithubListReposApiResult } from "."

const GithubRepoListCard: Component<{ repositories: GithubListReposApiResult }> = (props) => {
  return (
    <div class="prose prose-sm">
      <pre>{JSON.stringify(props.repositories, null, 2)}</pre>
    </div>
  )
}

export default GithubRepoListCard
