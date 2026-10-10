import sys

from PySide6.QtWidgets import QApplication,QMainWindow,QPushButton,QVBoxLayout,QWidget,QLabel

from module_field import FieldWindow
from module_image import ImageWindow
from module_diagnosis import DiagnosisWindow
from module_report import ReportWindow



class MainWindow(QMainWindow):

    def __init__(self):

        super().__init__()

        self.windows = {}

        self.setWindowTitle(
            "大田作物苗情智能诊断与农事决策支持系统 V1.0"
        )

        self.resize(1200,750)


        widget=QWidget()

        layout=QVBoxLayout()


        title=QLabel(
            "🌱 大田作物苗情智能诊断与农事决策支持系统 V1.0"
        )

        title.setStyleSheet(
            """
            font-size:28px;
            color:white;
            background:#2f7d4c;
            padding:20px;
            """
        )


        layout.addWidget(title)


        btn1=QPushButton(
            "地块与种植档案管理"
        )

        btn2=QPushButton(
            "苗情调查与图像分析"
        )

        btn3=QPushButton(
            "苗情诊断与辅助建议"
        )

        btn4=QPushButton(
            "调查记录与报告"
        )


        layout.addWidget(btn1)
        layout.addWidget(btn2)
        layout.addWidget(btn3)
        layout.addWidget(btn4)


        btn1.clicked.connect(self.open_field)
        btn2.clicked.connect(self.open_image)
        btn3.clicked.connect(self.open_diagnosis)
        btn4.clicked.connect(self.open_report)


        widget.setLayout(layout)

        self.setCentralWidget(widget)



    def open_field(self):

        self.open_window(FieldWindow)



    def open_image(self):

        self.open_window(ImageWindow)



    def open_diagnosis(self):

        self.open_window(DiagnosisWindow)



    def open_report(self):

        self.open_window(ReportWindow)

    def open_window(self, window_type):
        if window_type not in self.windows:
            self.windows[window_type] = window_type()
        window = self.windows[window_type]
        window.show()
        window.raise_()
        window.activateWindow()



def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    return app.exec()


if __name__ == "__main__":
    raise SystemExit(main())
