export default function Image(props) {
  return (
    <div className="image-wrapper">
      <img
        src={`${props.img}`}
        alt={`Photo of ${props.name}`}
        className="image-wrapper-photo"
      />
      <h1 className="image-wrapper-header">{props.name}</h1>
    </div>
  );
}
