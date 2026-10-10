from PySide6.QtWidgets import QWidget,QVBoxLayout,QLabel,QLineEdit,QPushButton


class FieldWindow(QWidget):

    def __init__(self):

        super().__init__()

        self.setWindowTitle(
            "地块与种植档案管理"
        )

        self.resize(600,500)


        layout=QVBoxLayout()


        layout.addWidget(
            QLabel("地块名称")
        )

        self.name=QLineEdit()

        layout.addWidget(self.name)



        layout.addWidget(
            QLabel("种植作物")
        )

        self.crop=QLineEdit()

        layout.addWidget(self.crop)



        layout.addWidget(
            QLabel("品种名称")
        )

        self.variety=QLineEdit()

        layout.addWidget(self.variety)



        btn=QPushButton(
            "保存种植档案"
        )


        layout.addWidget(btn)


        self.setLayout(layout)
