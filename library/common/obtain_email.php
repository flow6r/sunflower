<?php
/*从会话中获取新电子邮箱地址的脚本*/
//启动会话
session_start();

//检查会话变量
if (isset($_SESSION["usrEmail"])) echo $_SESSION["usrEmail"];
else echo "failed";

exit;
?>