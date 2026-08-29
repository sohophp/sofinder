<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Auth\GenericUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Auth::viaRequest('sofinder-demo', static fn (Request $request): GenericUser => new GenericUser([
            'id' => 'sofinder-demo',
            'name' => 'SoFinder Demo',
        ]));
        Gate::before(static fn (): bool => true);
    }
}
