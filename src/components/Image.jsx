export default function Image(props) {
  return (
    <div className="image-wrapper">
      <img src={`./img/${props.img}`} alt="" className="image-wrapper-photo" />
      <h1 className="image-wrapper-header">{props.name}</h1>
    </div>
  );
}
