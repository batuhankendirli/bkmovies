export default function SidebarList(props) {
  const dataMap = props.data.map((item) => {
    return (
      <li className="navigation-list-item selected-list">
        <ion-icon
          name={item.iconName}
          class="navigation-list-item-svg selected-list-item"
        />
        <a href="#" className="navigation-list-item-link selected-list-item">
          {item.text}
        </a>
      </li>
    );
  });

  return (
    <ul className="navigation-list">
      <h6 className="navigation-list-header">{props.header}</h6>
      {dataMap}
    </ul>
  );
}
