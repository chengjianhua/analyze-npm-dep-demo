const TAB_TOP = '┌──';
// const TAB_MIDDLE = '├──';
// const TAB_BOTTOM = '└──';
const TAB_MIDDLE = '├─ ';
const TAB_BOTTOM = '└─ ';
const PADDING = '   ';
const BREAK_LINE = '\n';

export default function printDependencies(tree, depth = 1) {
  // let depth = 1;

  return tree.reduce((acc, { name, version, children }, index, arr) => {
    let start = arr.length > 1 ? '│  ' : '   ';
    let end;
    const padCount = depth - 1;
    let padding = padCount > 0 ? PADDING.repeat(padCount) : '';

    if (index === arr.length - 1) {
      end = TAB_BOTTOM;
      // } else if (index < arr.length - 1) {
    } else {
      end = TAB_MIDDLE;
    }

    let line = start + padding + end + `${name}@${version}` + BREAK_LINE;

    if (children) {
      line += printDependencies(children, depth + 1);
    }

    return acc + line;
  }, '');
}
