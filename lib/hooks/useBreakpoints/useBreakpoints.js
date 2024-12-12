/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
const TABLET_WIDTH = 768;
const SMALL_DESKTOP_WIDTH = 1024;
const LARGE_DESKTOP_WIDTH = 1280;
const useBreakpoints = () => {
    const [isSm, setIsSm] = useState(false);
    const [isMd, setIsMd] = useState(false);
    const [isLg, setIsLg] = useState(false);
    const [isLgsm, setIsLgsm] = useState(false);
    const [isBreakpointsReady, setIsBreakpointsReady] = useState(false);
    const [isIos, setIsIos] = useState(false);
    useEffect(() => {
        const updateBreakpoints = () => {
            const { innerWidth } = window;
            setIsSm(innerWidth < TABLET_WIDTH);
            setIsMd(innerWidth >= TABLET_WIDTH && innerWidth < SMALL_DESKTOP_WIDTH);
            setIsLg(innerWidth >= SMALL_DESKTOP_WIDTH);
            setIsLgsm(innerWidth >= SMALL_DESKTOP_WIDTH && innerWidth < LARGE_DESKTOP_WIDTH);
        };
        updateBreakpoints();
        window.addEventListener('resize', updateBreakpoints);
        return () => window.removeEventListener('resize', updateBreakpoints);
    }, []);
    useEffect(() => {
        const breakpointIsDefined = [isSm, isMd, isLg, isLgsm].some((breakpoint) => !!breakpoint);
        if (breakpointIsDefined && !!navigator.platform) {
            setIsBreakpointsReady(true);
        }
    }, [isBreakpointsReady, isLg, isLgsm, isMd, isSm]);
    useEffect(() => {
        if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
            setIsIos(true);
        }
    }, []);
    return {
        isBreakpointsReady,
        isIos,
        isLg,
        isLgsm,
        isMd,
        isSm,
    };
};
export default useBreakpoints;
//# sourceMappingURL=useBreakpoints.js.map