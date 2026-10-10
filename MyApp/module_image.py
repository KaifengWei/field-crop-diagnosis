from PySide6.QtWidgets import QWidget,QVBoxLayout,QPushButton,QLabel


class ImageWindow(QWidget):

    def __init__(self):

        super().__init__()

        self.setWindowTitle(
            "苗情调查与图像分析"
        )


        layout=QVBoxLayout()


        label=QLabel(
            """
            图像分析流程：

            1. 导入田间图片

            2. ROI区域选择

            3. 植被区域识别

            4. 覆盖度计算
            """
        )


        layout.addWidget(label)


        btn=QPushButton(
            "导入图片"
        )

        layout.addWidget(btn)


        self.setLayout(layout)
