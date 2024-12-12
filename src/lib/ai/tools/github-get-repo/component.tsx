import { Component } from "solid-js"
import { GithubRepoApiResult } from "."

const GithubRepoCard: Component<{ repository: GithubRepoApiResult }> = (props) => {
  return (
    <div class="prose prose-sm">
      <pre>{JSON.stringify(props.repository, null, 2)}</pre>
    </div>
  )
}

export default GithubRepoCard
