// components/userjot-widget.tsx

export function UserJotWidget() {
  return (
    <>
      <script>
        {`window.$ujq=window.$ujq||[];window.uj=window.uj||new Proxy({},{get:(_,p)=>(...a)=>window.$ujq.push([p,...a])});document.head.appendChild(Object.assign(document.createElement('script'),{src:'https://cdn.userjot.com/sdk/v2/uj.js',type:'module',async:!0}));`}
      </script>
      <script>
        {`window.uj.init('cmj6zg7ap00ux14mmuuj2e4ei', {
          widget: true,
          position: 'left',
          theme: 'light'
        });`}
      </script>
    </>
  );
}
