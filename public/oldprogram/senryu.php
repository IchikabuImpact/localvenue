<?php
//$senryu = new Senryu();
//echo "test:".$senryu->execute("1");
//echo $senryu->rand();
require_once 'Zend/Translate.php';
class SenryuAdapter
{
   public $senryu;
   public function __construct(){}
   public function execute(){

    $senryu = new Senryu();
    $ja = array('senryu' => $senryu->rand());
    $senryuEn = new SenryuEn();
    $en = array('senryu' => $senryuEn->rand());
    $trans = new Zend_Translate(Zend_Translate::AN_ARRAY, $en , 'en');
	$trans->addTranslation($ja, 'ja');
	$trans->setLocale('auto');
	 return $trans->_('senryu');   
	}
}

 
class Senryu 
{
    private $tsv="senryu_ja.txt";
    const RANGE_FROM=0;
    const RANGE_TO=21;
 
    public $senryu;

    public function __construct()
    {
        $this->init();
    }

    public function init()
    {
        $buf = file_get_contents($this->tsv);
        $linesBuf = explode("\n", $buf);
        $lines = array_filter($linesBuf, 'strlen');  //空行を除去
        $records = array();
        $data = array();

        foreach ($lines as $key => $line) {
            if ( $key == 0) {
                continue;
            }
            $records = explode("\t", $line);
            if( !empty($records)){ 
                $num = $records[0];
                $sakuhin = $records[1];
                $data[$num] = $sakuhin;
            }
        }
       $this->senryu = $data;
    }

    public function execute($num)
    {
        if(empty($num)){
            return $this->senryu[1];
        }
        if(array_key_exists($num, $this->senryu)){
            return $this->senryu[strval($num)];
        }else{
            return $this->senryu[1];
        }
    }
    public function rand()
    {
       srand();
       $num = mt_rand(self::RANGE_FROM, self::RANGE_TO); 
       return $this->senryu[strval($num)];
    }
}
class SenryuEn extends Senryu{
  private $tsv="senryu_en.txt";
}

