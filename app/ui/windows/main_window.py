from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QLabel,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)

from app.core.config import (
    APP_NAME,
    APP_VERSION,
    WINDOW_MIN_HEIGHT,
    WINDOW_MIN_WIDTH,
)


class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()

        self.setWindowTitle(f"{APP_NAME} {APP_VERSION}")
        self.setMinimumSize(WINDOW_MIN_WIDTH, WINDOW_MIN_HEIGHT)

        title = QLabel(f"{APP_NAME} {APP_VERSION}")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)

        status = QLabel(
            "项目骨架已建立。\n"
            "当前阶段仅验证 Windows / Python / PySide6 桌面程序能够正常启动。"
        )
        status.setAlignment(Qt.AlignmentFlag.AlignCenter)

        exit_button = QPushButton("退出")
        exit_button.clicked.connect(self.close)

        layout = QVBoxLayout()
        layout.addStretch()
        layout.addWidget(title)
        layout.addWidget(status)
        layout.addWidget(exit_button)
        layout.addStretch()

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)
