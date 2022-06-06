declare module 'hide-cursor' {
    interface HideCursor{
        hide: ()=>void;
        show: ()=>void;
    }
    const cursor: HideCursor;
    export = cursor
}
  