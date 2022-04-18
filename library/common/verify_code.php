<?php
/*验证随机验证码的脚本*/
//获取POST请求的数据
$verfCode = $_POST["verfCode"];

//启动会话
session_start();

//检查验证码
if ($verfCode === strval($_SESSION["code"])) echo "valid";
else echo "invalid";

exit;
?>