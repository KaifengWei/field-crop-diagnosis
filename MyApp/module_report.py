from PySide6.QtWidgets import QWidget,QVBoxLayout,QLabel,QPushButton


class ReportWindow(QWidget):

    def __init__(self):

        super().__init__()


        self.setWindowTitle(
            "调查记录与报告"
        )


        layout=QVBoxLayout()


        layout.addWidget(
            QLabel(
            """
            历史调查记录

            调查图片

            分析结果

            PDF报告
            """
            )
        )


        btn=QPushButton(
            "生成PDF"
        )

        layout.addWidget(btn)


        self.setLayout(layout)
