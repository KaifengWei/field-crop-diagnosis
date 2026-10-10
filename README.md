# 大田作物苗情智能诊断与农事决策支持系统 V1.0

本仓库用于开发 **大田作物苗情智能诊断与农事决策支持系统 V1.0**。

## 当前阶段

当前仅建立 Windows 桌面项目骨架，目标是先形成稳定、可运行、可测试、可持续协作的开发基础。

当前尚未加入：
- 正式苗情识别算法
- 正式农学阈值与处方
- 深度学习病虫草害模型
- 生产数据库数据

## 技术路线

- Windows 11
- Python 3.11+
- PySide6
- OpenCV
- NumPy
- SQLite
- JSON 规则库
- Pandas / OpenPyXL
- PyInstaller

深度学习不是软件成立前提。后续若有经过验证的模型，优先通过 ONNX Runtime 接入。

## 本地启动

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m app.main
```

## 运行同事提供的 MyApp 界面

`MyApp` 是独立的 PySide6 界面原型，只依赖 PySide6。它的源码没有需要替换的个人电脑路径。在仓库根目录执行：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install "PySide6>=6.7,<7"
.\.venv\Scripts\python.exe .\MyApp\main.py
```

若已按上面的“本地启动”安装完整项目依赖，可直接执行最后一行。`MyApp` 目前只有界面；“保存种植档案”“导入图片”“生成PDF”等按钮尚未接入业务逻辑。
环境安装完成后，也可双击 `MyApp\run.cmd` 启动，脚本会按自身位置寻找项目内的 `.venv`，无需填写本机绝对路径。

## 开发原则

1. 功能必须真实可运行；
2. 算法输出必须可复核；
3. 农学规则必须有真实来源；
4. 未验证模型不得作为正式能力；
5. 不以代码行数作为完成标准；
6. Git 提交应真实反映开发过程。
