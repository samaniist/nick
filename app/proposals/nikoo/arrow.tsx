export default function Arrow({direction="up-right"}:{direction?:"up-right"|"right"|"down"|"up"}) {
 const rotation={"up-right":0,right:45,down:135,up:-45}[direction];
 return <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" style={{display:"inline-block",verticalAlign:"-.12em",flexShrink:0,transform:`rotate(${rotation}deg)`}} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19 19 5M5 5h14v14"/></svg>;
}
