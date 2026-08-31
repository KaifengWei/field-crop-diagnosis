import sys

from PySide6.QtWidgets import QApplication

from app.ui.windows.main_window import MainWindow


def main() -> int:
    app = QApplication(sys.argv)
    app.setApplicationName("大田作物苗情智能诊断与农事决策支持系统 V1.0")

    window = MainWindow()
    window.show()

    return app.exec()


if __name__ == "__main__":
    raise SystemExit(main())
