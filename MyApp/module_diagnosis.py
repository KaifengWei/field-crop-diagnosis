from PySide6.QtWidgets import QWidget,QVBoxLayout,QLabel


class DiagnosisWindow(QWidget):

    def __init__(self):

        super().__init__()


        self.setWindowTitle(
            "苗情诊断与辅助建议"
        )


        layout=QVBoxLayout()


        text=QLabel(
            """
            苗情状态：

            低于参考值

            接近参考值

            高于参考值


            输出辅助提示
            """
        )


        layout.addWidget(text)


        self.setLayout(layout)
