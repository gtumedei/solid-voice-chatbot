import { parse } from "marked"
import { ComponentProps, createResource, FlowComponent, splitProps } from "solid-js"

const Markdown: FlowComponent<ComponentProps<"div">, string> = (props) => {
  const [childrenProp, divProps] = splitProps(props, ["children"])

  const [html] = createResource(
    () => childrenProp.children,
    () => parse(childrenProp.children)
  )

  return <div {...divProps} innerHTML={html()} />
}

export default Markdown
