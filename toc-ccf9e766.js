// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="01_intro/00_welcome.html"><strong aria-hidden="true">1.</strong> 환영합니다</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="01_intro/01_syntax.html"><strong aria-hidden="true">1.1.</strong> 구문(Syntax)</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02_basic_calculator/00_intro.html"><strong aria-hidden="true">2.</strong> 기본 계산기</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02_basic_calculator/01_integers.html"><strong aria-hidden="true">2.1.</strong> 정수(Integers)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02_basic_calculator/02_variables.html"><strong aria-hidden="true">2.2.</strong> 변수(Variables)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02_basic_calculator/03_if_else.html"><strong aria-hidden="true">2.3.</strong> 조건문: if/else</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02_basic_calculator/04_panics.html"><strong aria-hidden="true">2.4.</strong> 패닉(Panics)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02_basic_calculator/05_factorial.html"><strong aria-hidden="true">2.5.</strong> 팩토리얼(Factorial)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02_basic_calculator/06_while.html"><strong aria-hidden="true">2.6.</strong> 반복문: while</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02_basic_calculator/07_for.html"><strong aria-hidden="true">2.7.</strong> 반복문: for</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02_basic_calculator/08_overflow.html"><strong aria-hidden="true">2.8.</strong> 오버플로우와 언더플로우(Overflow &amp; Underflow)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02_basic_calculator/09_saturating.html"><strong aria-hidden="true">2.9.</strong> 포화 연산(Saturating operations)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02_basic_calculator/10_as_casting.html"><strong aria-hidden="true">2.10.</strong> 타입 변환: as 캐스팅</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/00_intro.html"><strong aria-hidden="true">3.</strong> 티켓 관리 v1</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/01_struct.html"><strong aria-hidden="true">3.1.</strong> 구조체(Structs)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/02_validation.html"><strong aria-hidden="true">3.2.</strong> 유효성 검사(Validation)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/03_modules.html"><strong aria-hidden="true">3.3.</strong> 모듈(Modules)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/04_visibility.html"><strong aria-hidden="true">3.4.</strong> 가시성(Visibility)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/05_encapsulation.html"><strong aria-hidden="true">3.5.</strong> 캡슐화(Encapsulation)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/06_ownership.html"><strong aria-hidden="true">3.6.</strong> 소유권(Ownership)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/07_setters.html"><strong aria-hidden="true">3.7.</strong> 세터(Setters)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/08_stack.html"><strong aria-hidden="true">3.8.</strong> 스택(Stack)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/09_heap.html"><strong aria-hidden="true">3.9.</strong> 힙(Heap)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/10_references_in_memory.html"><strong aria-hidden="true">3.10.</strong> 메모리 내 참조(References in memory)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/11_destructor.html"><strong aria-hidden="true">3.11.</strong> 소멸자(Destructors)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03_ticket_v1/12_outro.html"><strong aria-hidden="true">3.12.</strong> 마무리</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/00_intro.html"><strong aria-hidden="true">4.</strong> 트레이트(Traits)</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/01_trait.html"><strong aria-hidden="true">4.1.</strong> 트레이트(Traits)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/02_orphan_rule.html"><strong aria-hidden="true">4.2.</strong> 고아 규칙(Orphan rule)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/03_operator_overloading.html"><strong aria-hidden="true">4.3.</strong> 연산자 오버로딩(Operator overloading)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/04_derive.html"><strong aria-hidden="true">4.4.</strong> Derive 매크로</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/05_trait_bounds.html"><strong aria-hidden="true">4.5.</strong> 트레이트 바운드(Trait bounds)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/06_str_slice.html"><strong aria-hidden="true">4.6.</strong> 문자열 슬라이스(String slices)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/07_deref.html"><strong aria-hidden="true">4.7.</strong> Deref 트레이트</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/08_sized.html"><strong aria-hidden="true">4.8.</strong> Sized 트레이트</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/09_from.html"><strong aria-hidden="true">4.9.</strong> From 트레이트</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/10_assoc_vs_generic.html"><strong aria-hidden="true">4.10.</strong> 연관 타입 vs 제네릭 타입(Associated vs Generic types)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/11_clone.html"><strong aria-hidden="true">4.11.</strong> Clone 트레이트</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/12_copy.html"><strong aria-hidden="true">4.12.</strong> Copy 트레이트</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/13_drop.html"><strong aria-hidden="true">4.13.</strong> Drop 트레이트</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04_traits/14_outro.html"><strong aria-hidden="true">4.14.</strong> 마무리</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/00_intro.html"><strong aria-hidden="true">5.</strong> 티켓 관리 v2</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/01_enum.html"><strong aria-hidden="true">5.1.</strong> 열거형(Enums)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/02_match.html"><strong aria-hidden="true">5.2.</strong> 조건문: match</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/03_variants_with_data.html"><strong aria-hidden="true">5.3.</strong> 데이터를 가진 베리언트(Variants with data)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/04_if_let.html"><strong aria-hidden="true">5.4.</strong> 조건문: if let 및 let/else</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/05_nullability.html"><strong aria-hidden="true">5.5.</strong> 널 허용성(Nullability)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/06_fallibility.html"><strong aria-hidden="true">5.6.</strong> 실패 가능성(Fallibility)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/07_unwrap.html"><strong aria-hidden="true">5.7.</strong> Unwrap</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/08_error_enums.html"><strong aria-hidden="true">5.8.</strong> 오류 열거형(Error enums)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/09_error_trait.html"><strong aria-hidden="true">5.9.</strong> Error 트레이트</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/10_packages.html"><strong aria-hidden="true">5.10.</strong> 패키지(Packages)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/11_dependencies.html"><strong aria-hidden="true">5.11.</strong> 의존성(Dependencies)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/12_thiserror.html"><strong aria-hidden="true">5.12.</strong> thiserror</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/13_try_from.html"><strong aria-hidden="true">5.13.</strong> TryFrom 트레이트</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/14_source.html"><strong aria-hidden="true">5.14.</strong> Error::source</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05_ticket_v2/15_outro.html"><strong aria-hidden="true">5.15.</strong> 마무리</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/00_intro.html"><strong aria-hidden="true">6.</strong> 티켓 관리 시스템</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/01_arrays.html"><strong aria-hidden="true">6.1.</strong> 배열(Arrays)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/02_vec.html"><strong aria-hidden="true">6.2.</strong> 벡터(Vectors)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/03_resizing.html"><strong aria-hidden="true">6.3.</strong> 크기 조정(Resizing)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/04_iterators.html"><strong aria-hidden="true">6.4.</strong> 반복자(Iterators)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/05_iter.html"><strong aria-hidden="true">6.5.</strong> Iter</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/06_lifetimes.html"><strong aria-hidden="true">6.6.</strong> 라이프타임(Lifetimes)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/07_combinators.html"><strong aria-hidden="true">6.7.</strong> 컴비네이터(Combinators)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/08_impl_trait.html"><strong aria-hidden="true">6.8.</strong> impl Trait</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/09_impl_trait_2.html"><strong aria-hidden="true">6.9.</strong> impl Trait 2부</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/10_slices.html"><strong aria-hidden="true">6.10.</strong> 슬라이스(Slices)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/11_mutable_slices.html"><strong aria-hidden="true">6.11.</strong> 가변 슬라이스(Mutable slices)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/12_two_states.html"><strong aria-hidden="true">6.12.</strong> 두 가지 상태(Two states)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/13_index.html"><strong aria-hidden="true">6.13.</strong> Index 트레이트</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/14_index_mut.html"><strong aria-hidden="true">6.14.</strong> IndexMut 트레이트</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/15_hashmap.html"><strong aria-hidden="true">6.15.</strong> 해시맵(HashMap)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06_ticket_management/16_btreemap.html"><strong aria-hidden="true">6.16.</strong> B-트리 맵(BTreeMap)</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/00_intro.html"><strong aria-hidden="true">7.</strong> 멀티스레딩(Threads)</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/01_threads.html"><strong aria-hidden="true">7.1.</strong> 스레드(Threads)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/02_static.html"><strong aria-hidden="true">7.2.</strong> &#39;static 라이프타임</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/03_leak.html"><strong aria-hidden="true">7.3.</strong> 메모리 누수(Memory leaks)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/04_scoped_threads.html"><strong aria-hidden="true">7.4.</strong> 스코프 스레드(Scoped threads)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/05_channels.html"><strong aria-hidden="true">7.5.</strong> 채널(Channels)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/06_interior_mutability.html"><strong aria-hidden="true">7.6.</strong> 내부 가변성(Interior mutability)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/07_ack.html"><strong aria-hidden="true">7.7.</strong> 응답(Ack) 패턴</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/08_client.html"><strong aria-hidden="true">7.8.</strong> 클라이언트(Client)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/09_bounded.html"><strong aria-hidden="true">7.9.</strong> 유한 채널(Bounded channels)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/10_patch.html"><strong aria-hidden="true">7.10.</strong> 패치(Patch)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/11_locks.html"><strong aria-hidden="true">7.11.</strong> Mutex, Send 및 Arc</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/12_rw_lock.html"><strong aria-hidden="true">7.12.</strong> RwLock</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/13_without_channels.html"><strong aria-hidden="true">7.13.</strong> 채널 없는 방식</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07_threads/14_sync.html"><strong aria-hidden="true">7.14.</strong> Sync 트레이트</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="08_futures/00_intro.html"><strong aria-hidden="true">8.</strong> 비동기 프로그래밍(Futures)</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="08_futures/01_async_fn.html"><strong aria-hidden="true">8.1.</strong> 비동기 함수(Async functions)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="08_futures/02_spawn.html"><strong aria-hidden="true">8.2.</strong> 태스크 스폰(Spawn)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="08_futures/03_runtime.html"><strong aria-hidden="true">8.3.</strong> 런타임(Runtime)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="08_futures/04_future.html"><strong aria-hidden="true">8.4.</strong> Future 트레이트</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="08_futures/05_blocking.html"><strong aria-hidden="true">8.5.</strong> 런타임 블로킹(Blocking)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="08_futures/06_async_aware_primitives.html"><strong aria-hidden="true">8.6.</strong> 비동기 지원 프리미티브</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="08_futures/07_cancellation.html"><strong aria-hidden="true">8.7.</strong> 취소(Cancellation)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="08_futures/08_outro.html"><strong aria-hidden="true">8.8.</strong> 마무리</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="going_further.html"><strong aria-hidden="true">9.</strong> 더 나아가기</a></span></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split('#')[0].split('?')[0];
        if (current_page.endsWith('/')) {
            current_page += 'index.html';
        }
        const links = Array.prototype.slice.call(this.querySelectorAll('a'));
        const l = links.length;
        for (let i = 0; i < l; ++i) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The 'index' page is supposed to alias the first chapter in the book.
            if (link.href === current_page
                || i === 0
                && path_to_root === ''
                && current_page.endsWith('/index.html')) {
                link.classList.add('active');
                let parent = link.parentElement;
                while (parent) {
                    if (parent.tagName === 'LI' && parent.classList.contains('chapter-item')) {
                        parent.classList.add('expanded');
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                const clientRect = e.target.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                sessionStorage.setItem('sidebar-scroll-offset', clientRect.top - sidebarRect.top);
            }
        }, { passive: true });
        const sidebarScrollOffset = sessionStorage.getItem('sidebar-scroll-offset');
        sessionStorage.removeItem('sidebar-scroll-offset');
        if (sidebarScrollOffset !== null) {
            // preserve sidebar scroll position when navigating via links within sidebar
            const activeSection = this.querySelector('.active');
            if (activeSection) {
                const clientRect = activeSection.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                const currentOffset = clientRect.top - sidebarRect.top;
                this.scrollTop += currentOffset - parseFloat(sidebarScrollOffset);
            }
        } else {
            // scroll sidebar to current active section when navigating via
            // 'next/previous chapter' buttons
            const activeSection = document.querySelector('#mdbook-sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        const sidebarAnchorToggles = document.querySelectorAll('.chapter-fold-toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(el => {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define('mdbook-sidebar-scrollbox', MDBookSidebarScrollbox);


// ---------------------------------------------------------------------------
// Support for dynamically adding headers to the sidebar.

(function() {
    // This is used to detect which direction the page has scrolled since the
    // last scroll event.
    let lastKnownScrollPosition = 0;
    // This is the threshold in px from the top of the screen where it will
    // consider a header the "current" header when scrolling down.
    const defaultDownThreshold = 150;
    // Same as defaultDownThreshold, except when scrolling up.
    const defaultUpThreshold = 300;
    // The threshold is a virtual horizontal line on the screen where it
    // considers the "current" header to be above the line. The threshold is
    // modified dynamically to handle headers that are near the bottom of the
    // screen, and to slightly offset the behavior when scrolling up vs down.
    let threshold = defaultDownThreshold;
    // This is used to disable updates while scrolling. This is needed when
    // clicking the header in the sidebar, which triggers a scroll event. It
    // is somewhat finicky to detect when the scroll has finished, so this
    // uses a relatively dumb system of disabling scroll updates for a short
    // time after the click.
    let disableScroll = false;
    // Array of header elements on the page.
    let headers;
    // Array of li elements that are initially collapsed headers in the sidebar.
    // I'm not sure why eslint seems to have a false positive here.
    // eslint-disable-next-line prefer-const
    let headerToggles = [];
    // This is a debugging tool for the threshold which you can enable in the console.
    let thresholdDebug = false;

    // Updates the threshold based on the scroll position.
    function updateThreshold() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // The number of pixels below the viewport, at most documentHeight.
        // This is used to push the threshold down to the bottom of the page
        // as the user scrolls towards the bottom.
        const pixelsBelow = Math.max(0, documentHeight - (scrollTop + windowHeight));
        // The number of pixels above the viewport, at least defaultDownThreshold.
        // Similar to pixelsBelow, this is used to push the threshold back towards
        // the top when reaching the top of the page.
        const pixelsAbove = Math.max(0, defaultDownThreshold - scrollTop);
        // How much the threshold should be offset once it gets close to the
        // bottom of the page.
        const bottomAdd = Math.max(0, windowHeight - pixelsBelow - defaultDownThreshold);
        let adjustedBottomAdd = bottomAdd;

        // Adjusts bottomAdd for a small document. The calculation above
        // assumes the document is at least twice the windowheight in size. If
        // it is less than that, then bottomAdd needs to be shrunk
        // proportional to the difference in size.
        if (documentHeight < windowHeight * 2) {
            const maxPixelsBelow = documentHeight - windowHeight;
            const t = 1 - pixelsBelow / Math.max(1, maxPixelsBelow);
            const clamp = Math.max(0, Math.min(1, t));
            adjustedBottomAdd *= clamp;
        }

        let scrollingDown = true;
        if (scrollTop < lastKnownScrollPosition) {
            scrollingDown = false;
        }

        if (scrollingDown) {
            // When scrolling down, move the threshold up towards the default
            // downwards threshold position. If near the bottom of the page,
            // adjustedBottomAdd will offset the threshold towards the bottom
            // of the page.
            const amountScrolledDown = scrollTop - lastKnownScrollPosition;
            const adjustedDefault = defaultDownThreshold + adjustedBottomAdd;
            threshold = Math.max(adjustedDefault, threshold - amountScrolledDown);
        } else {
            // When scrolling up, move the threshold down towards the default
            // upwards threshold position. If near the bottom of the page,
            // quickly transition the threshold back up where it normally
            // belongs.
            const amountScrolledUp = lastKnownScrollPosition - scrollTop;
            const adjustedDefault = defaultUpThreshold - pixelsAbove
                + Math.max(0, adjustedBottomAdd - defaultDownThreshold);
            threshold = Math.min(adjustedDefault, threshold + amountScrolledUp);
        }

        if (documentHeight <= windowHeight) {
            threshold = 0;
        }

        if (thresholdDebug) {
            const id = 'mdbook-threshold-debug-data';
            let data = document.getElementById(id);
            if (data === null) {
                data = document.createElement('div');
                data.id = id;
                data.style.cssText = `
                    position: fixed;
                    top: 50px;
                    right: 10px;
                    background-color: 0xeeeeee;
                    z-index: 9999;
                    pointer-events: none;
                `;
                document.body.appendChild(data);
            }
            data.innerHTML = `
                <table>
                  <tr><td>documentHeight</td><td>${documentHeight.toFixed(1)}</td></tr>
                  <tr><td>windowHeight</td><td>${windowHeight.toFixed(1)}</td></tr>
                  <tr><td>scrollTop</td><td>${scrollTop.toFixed(1)}</td></tr>
                  <tr><td>pixelsAbove</td><td>${pixelsAbove.toFixed(1)}</td></tr>
                  <tr><td>pixelsBelow</td><td>${pixelsBelow.toFixed(1)}</td></tr>
                  <tr><td>bottomAdd</td><td>${bottomAdd.toFixed(1)}</td></tr>
                  <tr><td>adjustedBottomAdd</td><td>${adjustedBottomAdd.toFixed(1)}</td></tr>
                  <tr><td>scrollingDown</td><td>${scrollingDown}</td></tr>
                  <tr><td>threshold</td><td>${threshold.toFixed(1)}</td></tr>
                </table>
            `;
            drawDebugLine();
        }

        lastKnownScrollPosition = scrollTop;
    }

    function drawDebugLine() {
        if (!document.body) {
            return;
        }
        const id = 'mdbook-threshold-debug-line';
        const existingLine = document.getElementById(id);
        if (existingLine) {
            existingLine.remove();
        }
        const line = document.createElement('div');
        line.id = id;
        line.style.cssText = `
            position: fixed;
            top: ${threshold}px;
            left: 0;
            width: 100vw;
            height: 2px;
            background-color: red;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(line);
    }

    function mdbookEnableThresholdDebug() {
        thresholdDebug = true;
        updateThreshold();
        drawDebugLine();
    }

    window.mdbookEnableThresholdDebug = mdbookEnableThresholdDebug;

    // Updates which headers in the sidebar should be expanded. If the current
    // header is inside a collapsed group, then it, and all its parents should
    // be expanded.
    function updateHeaderExpanded(currentA) {
        // Add expanded to all header-item li ancestors.
        let current = currentA.parentElement;
        while (current) {
            if (current.tagName === 'LI' && current.classList.contains('header-item')) {
                current.classList.add('expanded');
            }
            current = current.parentElement;
        }
    }

    // Updates which header is marked as the "current" header in the sidebar.
    // This is done with a virtual Y threshold, where headers at or below
    // that line will be considered the current one.
    function updateCurrentHeader() {
        if (!headers || !headers.length) {
            return;
        }

        // Reset the classes, which will be rebuilt below.
        const els = document.getElementsByClassName('current-header');
        for (const el of els) {
            el.classList.remove('current-header');
        }
        for (const toggle of headerToggles) {
            toggle.classList.remove('expanded');
        }

        // Find the last header that is above the threshold.
        let lastHeader = null;
        for (const header of headers) {
            const rect = header.getBoundingClientRect();
            if (rect.top <= threshold) {
                lastHeader = header;
            } else {
                break;
            }
        }
        if (lastHeader === null) {
            lastHeader = headers[0];
            const rect = lastHeader.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top >= windowHeight) {
                return;
            }
        }

        // Get the anchor in the summary.
        const href = '#' + lastHeader.id;
        const a = [...document.querySelectorAll('.header-in-summary')]
            .find(element => element.getAttribute('href') === href);
        if (!a) {
            return;
        }

        a.classList.add('current-header');

        updateHeaderExpanded(a);
    }

    // Updates which header is "current" based on the threshold line.
    function reloadCurrentHeader() {
        if (disableScroll) {
            return;
        }
        updateThreshold();
        updateCurrentHeader();
    }


    // When clicking on a header in the sidebar, this adjusts the threshold so
    // that it is located next to the header. This is so that header becomes
    // "current".
    function headerThresholdClick(event) {
        // See disableScroll description why this is done.
        disableScroll = true;
        setTimeout(() => {
            disableScroll = false;
        }, 100);
        // requestAnimationFrame is used to delay the update of the "current"
        // header until after the scroll is done, and the header is in the new
        // position.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Closest is needed because if it has child elements like <code>.
                const a = event.target.closest('a');
                const href = a.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    threshold = targetElement.getBoundingClientRect().bottom;
                    updateCurrentHeader();
                }
            });
        });
    }

    // Takes the nodes from the given head and copies them over to the
    // destination, along with some filtering.
    function filterHeader(source, dest) {
        const clone = source.cloneNode(true);
        clone.querySelectorAll('mark').forEach(mark => {
            mark.replaceWith(...mark.childNodes);
        });
        dest.append(...clone.childNodes);
    }

    // Scans page for headers and adds them to the sidebar.
    document.addEventListener('DOMContentLoaded', function() {
        const activeSection = document.querySelector('#mdbook-sidebar .active');
        if (activeSection === null) {
            return;
        }

        const main = document.getElementsByTagName('main')[0];
        headers = Array.from(main.querySelectorAll('h2, h3, h4, h5, h6'))
            .filter(h => h.id !== '' && h.children.length && h.children[0].tagName === 'A');

        if (headers.length === 0) {
            return;
        }

        // Build a tree of headers in the sidebar.

        const stack = [];

        const firstLevel = parseInt(headers[0].tagName.charAt(1));
        for (let i = 1; i < firstLevel; i++) {
            const ol = document.createElement('ol');
            ol.classList.add('section');
            if (stack.length > 0) {
                stack[stack.length - 1].ol.appendChild(ol);
            }
            stack.push({level: i + 1, ol: ol});
        }

        // The level where it will start folding deeply nested headers.
        const foldLevel = 3;

        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const level = parseInt(header.tagName.charAt(1));

            const currentLevel = stack[stack.length - 1].level;
            if (level > currentLevel) {
                // Begin nesting to this level.
                for (let nextLevel = currentLevel + 1; nextLevel <= level; nextLevel++) {
                    const ol = document.createElement('ol');
                    ol.classList.add('section');
                    const last = stack[stack.length - 1];
                    const lastChild = last.ol.lastChild;
                    // Handle the case where jumping more than one nesting
                    // level, which doesn't have a list item to place this new
                    // list inside of.
                    if (lastChild) {
                        lastChild.appendChild(ol);
                    } else {
                        last.ol.appendChild(ol);
                    }
                    stack.push({level: nextLevel, ol: ol});
                }
            } else if (level < currentLevel) {
                while (stack.length > 1 && stack[stack.length - 1].level > level) {
                    stack.pop();
                }
            }

            const li = document.createElement('li');
            li.classList.add('header-item');
            li.classList.add('expanded');
            if (level < foldLevel) {
                li.classList.add('expanded');
            }
            const span = document.createElement('span');
            span.classList.add('chapter-link-wrapper');
            const a = document.createElement('a');
            span.appendChild(a);
            a.href = '#' + header.id;
            a.classList.add('header-in-summary');
            filterHeader(header.children[0], a);
            a.addEventListener('click', headerThresholdClick);
            const nextHeader = headers[i + 1];
            if (nextHeader !== undefined) {
                const nextLevel = parseInt(nextHeader.tagName.charAt(1));
                if (nextLevel > level && level >= foldLevel) {
                    const toggle = document.createElement('a');
                    toggle.classList.add('chapter-fold-toggle');
                    toggle.classList.add('header-toggle');
                    toggle.addEventListener('click', () => {
                        li.classList.toggle('expanded');
                    });
                    const toggleDiv = document.createElement('div');
                    toggleDiv.textContent = '❱';
                    toggle.appendChild(toggleDiv);
                    span.appendChild(toggle);
                    headerToggles.push(li);
                }
            }
            li.appendChild(span);

            const currentParent = stack[stack.length - 1];
            currentParent.ol.appendChild(li);
        }

        const onThisPage = document.createElement('div');
        onThisPage.classList.add('on-this-page');
        onThisPage.append(stack[0].ol);
        const activeItemSpan = activeSection.parentElement;
        activeItemSpan.after(onThisPage);
    });

    document.addEventListener('DOMContentLoaded', reloadCurrentHeader);
    document.addEventListener('scroll', reloadCurrentHeader, { passive: true });
})();

