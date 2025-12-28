<?php

declare(strict_types=1);

use PhpCsFixer\Fixer\ArrayNotation\ArraySyntaxFixer;
use Symplify\EasyCodingStandard\Config\ECSConfig;

return function (ECSConfig $ecsConfig): void {
    $ecsConfig->rules([
        ArraySyntaxFixer::class,
    ]);
};
