<?php

namespace App;

enum TaskStatus: string
{
    case CANCELED = 'canceled';
    case COMPLETED = 'completed';
    case PENDING = 'pending';
}
