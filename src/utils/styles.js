export function addStyles(css, id="1") {
  const styles = document.createElement('style');
  const head = document.querySelector('head');
  styles.media = 'screen';
  styles.id = id;

  styles.innerHTML = css;
  head.insertBefore(styles, head.lastChild)
}

export function removeStyles(id) {
  const styles = document.getElementById(id);
  styles?.remove();
}
