<?php

declare(strict_types=1);

use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ResponseFactory;
use Slim\Psr7\Factory\StreamFactory;
use SoFinderExample\RuntimeFactory;

require dirname(__DIR__) . '/vendor/autoload.php';

$responses = new ResponseFactory();
$application = AppFactory::create($responses);
RuntimeFactory::create($responses, new StreamFactory())->routes()->registerSlim($application);
$application->run();
