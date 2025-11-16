<?php
//require_once("text_ja.php");
$targetDateSuffix=$this->targetDateSuffix;
$preClassName= uniqid();

?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="author" content="K.Kodama">
<meta property="og:type" content="website">
<meta property="og:description" content="<?php echo $this->trans->_('siteTitle') . "," .$this->trans->_('siteDesc') ?>">
<meta property="og:title" content="<?php echo $this->trans->_('siteTitle') ?>">
<meta property="og:url" content="http://ckeiba.appstarrocks.com/">
<meta property="og:image" content="http://ckeiba.appstarrocks.com/images/anauma-kuruko408.png">
<meta property="og:site_name" content="<?php echo $this->trans->_('siteTitle') ?>">
<meta property="og:locale" content="ja_JP">
<meta name="keywords" content="<?php echo $this->trans->_('siteTitle') ?>" />
<meta name="description" content="<?php echo $this->trans->_('siteTitle') . "," .$this->trans->_('siteDesc') ?>">
<meta name="google-site-verification" content="kkR57VEj9LZJ3c5NwlWCrPDMuwQTbAEAEH6t0Jz2AC0" />
 <meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php echo $this->trans->_('siteTitle') ?></title>
<link rel="alternate" hreflang="ja" href="http://ckeiba.appstarrocks.com/index.php">
<link rel="shortcut icon" href="favicon.ico" >
<link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.0/jquery.mobile-1.4.0.min.css" />
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script src="http://code.jquery.com/mobile/1.4.0/jquery.mobile-1.4.0.min.js"></script>
<link rel="stylesheet" href="/css/style.css" />

 </head>
<body>
<div id="content" data-role="content" data-theme="c" >
<div id="header" class="ui-bar" data-role="header" data-position="fixed">
        <h2>kenchanbakenのAI予想(地方競馬)</h2>
        <a  href="/">HOME</a>
        <a  href="/recover.php" style="margin-right:40px" ><?php echo $this->trans->_('label_recover') ?></a>
    </div>
    <div class="body1">
        <div><img src="/images/kenchanbaken.png" alt="anamuma-kuruko" /></div>
        <h4> <?php echo $this->trans->_('siteTitle') ?>
        <div class="about"><?php  echo $this->trans->_('siteDesc') ?></div></h4>
        <h4><?php echo $this->trans->_('label_senryu') ?>:</h4>
        <h4>
        <a href="https://x.com/kenchanbaken"><img src="/images/kenchanbaken.png" alt="kenchanbaken" style="width:40px; height:40px" /></a> &lt; /h4>
    </div>       <div id='raceList'> 
  		<p><?php echo $targetDateSuffix?></p>
<pre  class="<?php echo $preClassName; ?>"><?php
$targetFile =$this->public_dir."/yosou/recovery". $targetDateSuffix  . ".txt";
if(file_exists($targetFile)){
	require_once($targetFile );
}
?></pre>
<pre class="<?php echo $preClassName; ?>">

馬場 レース 推奨馬番　配当
<?php
$resultFile =$this->public_dir."/yosou/result". $targetDateSuffix  . ".txt";
if(file_exists($resultFile)){
	require_once( $resultFile);
}
?></pre>

<hr/>
<div class="ads">
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- 謙ちゃん馬券　レスポンシブ -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-4498051423313001"
     data-ad-slot="1499448666"
     data-ad-format="auto"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
</div> <!--ads-->
<hr/>
<?php require_once("amazon.php");?>
<hr/>
</div>
<div data-role="footer" >
 <p><?php echo $this->trans->_('notes') ?></p>
                 <h4>
				<a rel="author" href="http://developer.appstarrocks.com/" ><?php echo $this->trans->_('copyright')  ?><a>
</h4>
</div><!--footer-->
</div><!--content-->
</div><!-- pages-->

<script>
$("a").attr({ "data-ajax":"false" });
</script>
</body>
</html>
