# Workout Atlas

这是一个用于展示个人运动轨迹的静态网站。项目基于 React、Vite、Tailwind CSS 和 Mapbox，把同步后的运动数据展示为地图轨迹、年度切换、月度里程、运动表格、GitHub 风格热力图和 Grid 轨迹图。

## 项目参考

- [yihong0618/running_page](https://github.com/yihong0618/running_page)
- [ben-29/workouts_page](https://github.com/ben-29/workouts_page)
- [椒盐豆豉：也搞了一个展示行走数据的页面](https://blog.douchi.space/steps-page/)

## 页面内容

- 顶部摘要：总里程、总次数、总时长、平均配速、平均心率、最长单次距离和 PB。
- 年份切换：可按年份查看对应运动轨迹，也可以切换到 Total 查看全量数据。
- 地图视图：展示运动轨迹，点击表格或热力图日期后会定位到对应活动。
- 月度里程：当前年份的每月距离柱状图。
- 活动表格：支持按类型、距离、爬升、配速、心率、时长和开始时间排序。
- Total 视图：展示 `assets/github.svg` 和 `assets/grid.svg`。

## 技术栈

- 前端：React 18、Vite、TypeScript、Tailwind CSS
- 地图：Mapbox GL、react-map-gl
- 图表和 SVG：Recharts、自定义 Python SVG 生成脚本
- 数据同步：`run_page` 下的 Python 脚本
- 部署：Vercel 或 GitHub Pages

## 本地运行

需要 Node.js 20+、Python 3 和 pnpm。

```bash
pip3 install -r requirements.txt
corepack enable
pnpm install
pnpm dev
```

构建静态产物：

```bash
pnpm build
```

构建结果会输出到 `dist`。

## 数据同步

项目最终读取的是 `src/static/activities.json`，数据通常由 `run_page` 下的同步脚本生成。

### Garmin

复制配置文件并填入账号信息：

```bash
cp config-example.yaml config.yaml
python3 run_page/garmin_sync.py
```

### Strava

1. 在 Strava 创建 API 应用，获取 `client_id` 和 `client_secret`。
2. 打开授权链接并取得 `code`。

```text
https://www.strava.com/oauth/authorize?client_id=你的CLIENT_ID&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read_all,profile:read_all,activity:read_all
```

3. 用 `code` 换取 `refresh_token`。

```bash
curl -X POST https://www.strava.com/oauth/token \
  -F client_id=你的CLIENT_ID \
  -F client_secret=你的CLIENT_SECRET \
  -F code=你的CODE \
  -F grant_type=authorization_code
```

4. 同步数据。

```bash
python3 run_page/strava_sync.py 你的CLIENT_ID 你的CLIENT_SECRET 你的REFRESH_TOKEN
```

### Keep

```bash
python3 run_page/keep_sync.py 你的手机号 你的密码
```

## 生成 SVG

Total 页面会加载 `assets/github.svg` 和 `assets/grid.svg`。年度小图由 circular 类型生成到 `assets/year_*.svg`。

```bash
python3 run_page/gen_svg.py --from-db --title "Calendar" --type github --athlete "HY Kong" --output assets/github.svg --use-localtime --min-distance 0.5
python3 run_page/gen_svg.py --from-db --title "Data Over 5km" --type grid --athlete "HY Kong" --output assets/grid.svg --min-distance 4.7 --use-localtime
python3 run_page/gen_svg.py --from-db --type circular --use-localtime
```

## 自动更新

GitHub Actions 工作流位于 `.github/workflows/run_data_sync.yml`。

常用环境变量：

- `RUN_TYPE`：数据来源，例如 `strava`、`garmin`、`keep`。
- `ATHLETE`：展示在生成图里的名字。
- `TITLE`：GitHub 热力图标题。
- `MIN_GRID_DISTANCE`：Grid 图的最小距离过滤。
- `TITLE_GRID`：Grid 图标题。
- `BUILD_GH_PAGES`：是否在同步后发布 GitHub Pages。

常用 Secrets：

- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_CLIENT_REFRESH_TOKEN`
- `KEEP_MOBILE`
- `KEEP_PASSWORD`
- `GARMIN_SECRET_STRING`
- `GARMIN_SECRET_STRING_CN`

GitHub Pages 设置：

1. Settings -> Actions -> General -> Workflow permissions，选择 Read and write permissions。
2. Settings -> Pages -> Build and deployment -> Source，选择 GitHub Actions。
3. Actions -> Run Data Sync -> Run workflow，手动触发一次同步和部署。

## 更新旧数据

重新生成全量数据时，先清理旧产物，再运行同步。

```bash
pnpm run clean
```

如果是在 Windows 上执行，建议使用 WSL 或 Git Bash，因为清理脚本使用了 Unix 风格命令。

## 样式修改入口

- 页面标题和基础元信息：`index.html`、`src/static/site-metadata.ts`
- 页面整体布局：`src/components/Layout/index.tsx`
- 全局背景、滚动条、Mapbox 控件：`src/styles/index.css`
- Tailwind 主题色和圆角：`tailwind.config.js`
- 顶部导航：`src/components/Header/index.tsx`
- 顶部统计：`src/components/DashboardStats`
- 年份切换和地图外观：`src/components/RunMap`
- 表格外观：`src/components/RunTable/style.module.css`
- Total SVG 容器：`src/components/SVGStat`
- 运动类型和轨迹颜色：`src/utils/const.ts`

## 配置提示

- 地图 token：在 `src/utils/const.ts` 修改 `MAPBOX_TOKEN`。
- 中文模式：在 `src/utils/const.ts` 修改 `IS_CHINESE`。
- 地图标签：在 `src/utils/const.ts` 修改 `ROAD_LABEL_DISPLAY`。
- 隐私模式：在 `src/utils/const.ts` 修改 `PRIVACY_MODE`。
- 默认地图高度：在 `src/utils/const.ts` 修改 `MAP_HEIGHT`。

## Fork 后检查

- 确认 `.github/workflows/gh-pages.yml` 使用的默认分支是否和你的仓库一致。
- 修改 `.github/workflows/run_data_sync.yml` 里的 `RUN_TYPE`、`ATHLETE`、`TITLE`、`MIN_GRID_DISTANCE` 和 `TITLE_GRID`。
- 删除示例数据后重新同步：`src/static/activities.json`、`run_page/data.db`。
- 按自己的数据来源配置对应 Secrets。
