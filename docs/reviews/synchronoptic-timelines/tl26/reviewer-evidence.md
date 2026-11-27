# Independent checkpoint 26 terminal evidence

Run canon-20261108-071242, 2026-11-08 UTC. Node v24.22.1. Head 4d022abe9fd2f525395736e041f9547c1479e9ec; parent 66c80f1f50e44d32bc68c404a4e4addac77e1d57.

Original reviewer probe from main `tl25/reviewer-chapter-history.cjs`: parent unchanged; head changes only the expected engine blob from 56d47d017dbf4a13b19a49a0d4a888a39863c819 to b6650d6fe7a33fa0d2d8c9b3ac27ea3a883fdedf (hash assertions retained). Expanded probe is unchanged from the audited head. Both probes extract actual host functions but use view/rendering/history test doubles; neither is a browser test. Files copied locally without modifying either PR branch.

## reviewer-head

Command: `node reviewer-head.cjs <head-checkout>`. Exit 0.

```text
{"name":"control: unchanged chapter restores selection","pass":true,"incoming":"#book=1&ch=3&tl=1&tlsel=record-b","chapter":3,"open":true,"selection":"record-b","hash":"#book=1&ch=3&tl=1&tlsel=record-b","writes":[],"restores":["#book=1&ch=3&tl=1&tlsel=record-b"]}
{"name":"changed chapter restores selection","pass":true,"incoming":"#book=1&ch=3&tl=1&tlsel=record-b","chapter":3,"open":true,"selection":"record-b","hash":"#book=1&ch=3&tl=1&tlsel=record-b","writes":[],"restores":["#book=1&ch=3&tl=1&tlsel=record-b"]}
{"name":"control: unchanged chapter opens timeline","pass":true,"incoming":"#book=1&ch=3&tl=1&tlsel=record-b","chapter":3,"open":true,"selection":"record-b","hash":"#book=1&ch=3&tl=1&tlsel=record-b","writes":[],"restores":["#book=1&ch=3&tl=1&tlsel=record-b"]}
{"name":"changed chapter opens timeline","pass":true,"incoming":"#book=1&ch=3&tl=1&tlsel=record-b","chapter":3,"open":true,"selection":"record-b","hash":"#book=1&ch=3&tl=1&tlsel=record-b","writes":[],"restores":["#book=1&ch=3&tl=1&tlsel=record-b"]}
{"name":"changed chapter closes timeline","pass":true,"incoming":"#book=1&ch=3","chapter":3,"open":false,"selection":null,"hash":"#book=1&ch=3","writes":[],"restores":[]}
5/5 behavioural expectations pass (2 controls; 3 changed-chapter cases).
```

## reviewer-parent

Command: `node reviewer-parent.cjs <parent-checkout>`. Exit 1.

```text
{"name":"control: unchanged chapter restores selection","pass":true,"incoming":"#book=1&ch=3&tl=1&tlsel=record-b","chapter":3,"open":true,"selection":"record-b","hash":"#book=1&ch=3&tl=1&tlsel=record-b","writes":[],"restores":["#book=1&ch=3&tl=1&tlsel=record-b"]}
{"name":"changed chapter restores selection","pass":false,"incoming":"#book=1&ch=3&tl=1&tlsel=record-b","chapter":3,"open":true,"selection":null,"hash":"#book=1&ch=3&tl=1","writes":["/atlas/#book=1&ch=3&tl=1"],"restores":[]}
{"name":"control: unchanged chapter opens timeline","pass":true,"incoming":"#book=1&ch=3&tl=1&tlsel=record-b","chapter":3,"open":true,"selection":"record-b","hash":"#book=1&ch=3&tl=1&tlsel=record-b","writes":[],"restores":["#book=1&ch=3&tl=1&tlsel=record-b"]}
{"name":"changed chapter opens timeline","pass":false,"incoming":"#book=1&ch=3&tl=1&tlsel=record-b","chapter":3,"open":false,"selection":null,"hash":"#book=1&ch=3","writes":["/atlas/#book=1&ch=3"],"restores":[]}
{"name":"changed chapter closes timeline","pass":false,"incoming":"#book=1&ch=3","chapter":3,"open":true,"selection":null,"hash":"#book=1&ch=3&tl=1","writes":["/atlas/#book=1&ch=3&tl=1"],"restores":[]}
2/5 behavioural expectations pass (2 controls; 3 changed-chapter cases).
```

## expanded-head

Command: `node <head-checkout>/docs/reviews/synchronoptic-timelines/tl26/history-transaction-probe.cjs <head-checkout>`. Exit 0.

```text
engine blob b6650d6fe7a33fa0d2d8c9b3ac27ea3a883fdedf / timeline blob a16d2a10d7ccee44fd15674f745c8617cdfdd65c
PASS control: same chapter, open, restore selection {"got":{"chapter":3,"open":true,"sel":"record-b","order":"x,y,z","collapsed":"","hash":"#book=1&ch=3&tl=1&tlsel=record-b"},"writes":0,"restores":1}
PASS control: same chapter, closed, open + select {"got":{"chapter":3,"open":true,"sel":"record-b","order":"x,y,z","collapsed":"","hash":"#book=1&ch=3&tl=1&tlsel=record-b"},"writes":0,"restores":1}
PASS chapter change, open, restore selection {"got":{"chapter":3,"open":true,"sel":"record-b","order":"x,y,z","collapsed":"","hash":"#book=1&ch=3&tl=1&tlsel=record-b"},"writes":0,"restores":1}
PASS chapter change, closed, open + select {"got":{"chapter":3,"open":true,"sel":"record-b","order":"x,y,z","collapsed":"","hash":"#book=1&ch=3&tl=1&tlsel=record-b"},"writes":0,"restores":1}
PASS chapter change closes timeline {"got":{"chapter":3,"open":false,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=3"},"writes":0,"restores":0}
PASS chapter change gates selection out (later record) {"got":{"chapter":3,"open":true,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=3&tl=1"},"writes":1,"restores":1}
PASS chapter raised admits selection gated at old chapter {"got":{"chapter":5,"open":true,"sel":"record-late","order":"x,y,z","collapsed":"","hash":"#book=1&ch=5&tl=1&tlsel=record-late"},"writes":0,"restores":1}
PASS chapter change + lane order/collapse restored {"got":{"chapter":4,"open":true,"sel":"record-b","order":"z,x,y","collapsed":"y","hash":"#book=1&ch=4&tl=z%2Cx%2Cy&tlc=y&tlsel=record-b"},"writes":0,"restores":1}
PASS chapter change + default order replaces custom order {"got":{"chapter":2,"open":true,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=2&tl=1"},"writes":0,"restores":1}
PASS missing ch → Not set, selection gated out {"got":{"chapter":null,"open":true,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&tl=1"},"writes":1,"restores":1}
PASS invalid ch → Not set, timeline closes {"got":{"chapter":null,"open":false,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1"},"writes":1,"restores":0}
PASS Back/Forward traversal over 3 entries, 7 steps (each lands on its own URL, unchanged)
12/12 history transaction checks pass
```

## expanded-parent

Command: `node <head-checkout>/docs/reviews/synchronoptic-timelines/tl26/history-transaction-probe.cjs <parent-checkout>`. Exit 1.

```text
engine blob 56d47d017dbf4a13b19a49a0d4a888a39863c819 / timeline blob a16d2a10d7ccee44fd15674f745c8617cdfdd65c
PASS control: same chapter, open, restore selection {"got":{"chapter":3,"open":true,"sel":"record-b","order":"x,y,z","collapsed":"","hash":"#book=1&ch=3&tl=1&tlsel=record-b"},"writes":0,"restores":1}
PASS control: same chapter, closed, open + select {"got":{"chapter":3,"open":true,"sel":"record-b","order":"x,y,z","collapsed":"","hash":"#book=1&ch=3&tl=1&tlsel=record-b"},"writes":0,"restores":1}
FAIL chapter change, open, restore selection {"got":{"chapter":3,"open":true,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=3&tl=1"},"writes":1,"restores":0}
FAIL chapter change, closed, open + select {"got":{"chapter":3,"open":false,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=3"},"writes":1,"restores":0}
FAIL chapter change closes timeline {"got":{"chapter":3,"open":true,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=3&tl=1"},"writes":1,"restores":0}
PASS chapter change gates selection out (later record) {"got":{"chapter":3,"open":true,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=3&tl=1"},"writes":1,"restores":0}
FAIL chapter raised admits selection gated at old chapter {"got":{"chapter":5,"open":false,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=5"},"writes":1,"restores":0}
FAIL chapter change + lane order/collapse restored {"got":{"chapter":4,"open":true,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=4&tl=1"},"writes":1,"restores":0}
FAIL chapter change + default order replaces custom order {"got":{"chapter":2,"open":true,"sel":null,"order":"z,x,y","collapsed":"y","hash":"#book=1&ch=2&tl=z%2Cx%2Cy&tlc=y"},"writes":1,"restores":0}
PASS missing ch → Not set, selection gated out {"got":{"chapter":null,"open":true,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&tl=1"},"writes":1,"restores":0}
FAIL invalid ch → Not set, timeline closes {"got":{"chapter":null,"open":true,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&tl=1"},"writes":1,"restores":0}
  traversal step to entry 1 FAIL {"chapter":3,"open":false,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=3"}
  traversal step to entry 2 FAIL {"chapter":5,"open":false,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=5"}
  traversal step to entry 1 FAIL {"chapter":3,"open":false,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=3"}
  traversal step to entry 1 FAIL {"chapter":3,"open":false,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=3"}
  traversal step to entry 2 FAIL {"chapter":5,"open":false,"sel":null,"order":"x,y,z","collapsed":"","hash":"#book=1&ch=5"}
FAIL Back/Forward traversal over 3 entries, 7 steps (each lands on its own URL, unchanged)
4/12 history transaction checks pass
```

## unit-head

Command: `node --test <head-checkout>/tests/atlas-timeline-sw.test.ts`. Exit 0.

```text
✔ adapterFor picks the tree adapter, the Standard Works adapter, or none (1.033459ms)
✔ one record per event, site, route and card; nothing gains a date (0.747738ms)
✔ travel edges only from dated routes, between mapped consecutive stops, never drawn without a source (0.67618ms)
✔ see links: typed with their own wording, reciprocal pairs once, dangling counted, offices are not succession (0.203086ms)
✔ chapterOk: fail closed in the current book without a chapter selector (0.159651ms)
✔ chapterOk: books-derived and explicit first books honour the chapter threshold (TL-R11) (0.256477ms)
✔ chapter gate through the adapter: books-only cards/sites carry first and are filtered before counts and search (1.116133ms)
✔ wiring prerequisites: layerless overview cards sit on a "Standard Works overview" lane (0.573465ms)
✔ folded undated panels keep every gated record in source order; search reaches closed panels (1.105107ms)
✔ chapterCount: only positive-integer chapters declare a selector (0.442247ms)
✔ chapterPos: valid positions and fail-closed rejects (0.31821ms)
✔ chapterOk with a selected chapter: earlier book safe, current book by chapter, later book hidden (0.12606ms)
ℹ tests 12
ℹ suites 0
ℹ pass 12
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 155.824587
```

## browser-launch

Command: `Playwright chromium.launch({executablePath:'/usr/bin/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']})`. Exit 1.

```text
browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> /usr/bin/chromium --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,BlockOriginHeaderModificationOnRedirect,Translate,AutoDeElevate,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --disable-updater-scheduler --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist --user-data-dir=/tmp/playwright_chromiumdev_profile-7NYMQK --remote-debugging-pipe --no-startup-window
<launched> pid=16
[pid=16][err] /usr/bin/chromium: 9: [: 5225713664: unexpected operator
[pid=16][err] [16:16:1108/071350.541549:FATAL:chrome/browser/process_singleton_posix.cc:297] Check failed: . socket() failed: Operation not permitted (1)
[pid=16][err] [1108/071350.541762:ERROR:third_party/crashpad/crashpad/util/linux/scoped_ptrace_attach.cc:27] ptrace: Operation not permitted (1)
Call log:
  - <launching> /usr/bin/chromium --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,BlockOriginHeaderModificationOnRedirect,Translate,AutoDeElevate,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --disable-updater-scheduler --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist --user-data-dir=/tmp/playwright_chromiumdev_profile-7NYMQK --remote-debugging-pipe --no-startup-window
  - <launched> pid=16
  - [pid=16][err] /usr/bin/chromium: 9: [: 5225713664: unexpected operator
  - [pid=16][err] [16:16:1108/071350.541549:FATAL:chrome/browser/process_singleton_posix.cc:297] Check failed: . socket() failed: Operation not permitted (1)
  - [pid=16][err] [1108/071350.541762:ERROR:third_party/crashpad/crashpad/util/linux/scoped_ptrace_attach.cc:27] ptrace: Operation not permitted (1)
  - [pid=16] <gracefully close start>
  - [pid=16] <kill>
  - [pid=16] <will force kill>
  - [pid=16] <process did exit: exitCode=null, signal=SIGABRT>
  - [pid=16] starting temporary directories cleanup
  - [pid=16] finished temporary directories cleanup
  - [pid=16] <gracefully close end>

```

