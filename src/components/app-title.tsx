import { Title } from "@solidjs/meta"
import { ParentComponent } from "solid-js"

const AppTitle: ParentComponent = (props) => {
  return (
    <Title>
      {props.children ? `${props.children} • solid-voice-chatbot` : "solid-voice-chatbot"}
    </Title>
  )
}

export default AppTitle
