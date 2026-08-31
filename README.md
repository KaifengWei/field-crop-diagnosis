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

## 开发原则

1. 功能必须真实可运行；
2. 算法输出必须可复核；
3. 农学规则必须有真实来源；
4. 未验证模型不得作为正式能力；
5. 不以代码行数作为完成标准；
6. Git 提交应真实反映开发过程。
